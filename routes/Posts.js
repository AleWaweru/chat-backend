const express = require('express');
const router = express.Router();
const PostModel = require('../models/Posts');
const Like = require('../models/Likes');
const { validateToken } = require('../middlewares/AuthMiddleware');

router.get("/", validateToken, async (req, res) => {
    try {
        const listOfPosts = await PostModel.find().populate('likes');
        const likedPosts = await Like.find({ userId: req.user._id });

        res.json({ listOfPosts: listOfPosts, likedPosts: likedPosts });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get("/byId/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const post = await PostModel.findById(id);

        res.json(post);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get("/byUserId/:id", async (req, res) => {
    try {
        const id = req.params._id;
        const listOfPosts = await PostModel.find({ userId: id }).populate('likes');

        res.json(listOfPosts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post("/", validateToken, async (req, res) => {
    try {
        const post = req.body;
        post.username = req.user.username;
        post.userId = req.user._id;
        await PostModel.create(post);

        res.json(post);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put("/title", validateToken, async (req, res) => {
    try {
        const { newTitle, id } = req.body;
        await PostModel.findByIdAndUpdate(id, { title: newTitle });

        res.json({ newTitle });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put("/postText", validateToken, async (req, res) => {
    try {
        const { newPostText, id } = req.body;
        await PostModel.findByIdAndUpdate(id, { postText: newPostText });

        res.json({ newPostText });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete("/:postId", validateToken, async (req, res) => {
    try {
        const postId = req.params.postId;
        await PostModel.findByIdAndDelete(postId);

        res.json("DELETED SUCCESSFULLY");
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
