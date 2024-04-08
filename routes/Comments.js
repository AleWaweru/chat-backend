const express = require('express');
const router = express.Router();
const CommentModel = require('../models/Comments');
const { validateToken } = require('../middlewares/AuthMiddleware');

router.get("/:postId", async (req, res) => {
    try {
      const postId = req.params.postId;
      const comments = await CommentModel.find({ postId: postId });
  
      res.json(comments);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  

router.post("/", validateToken, async (req, res) => {
    try {
        const { commentBody, postId } = req.body;
        const username = req.user.username;
        const comment = await CommentModel.create({
            commentBody: commentBody,
            postId: postId,
            username: username
        });

        res.json(comment);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// server/routes/Comments.js

router.put("/:commentId", validateToken, async (req, res) => {
    try {
        const commentId = req.params.commentId;
        const { commentBody } = req.body;
        const updatedComment = await CommentModel.findByIdAndUpdate(
            commentId,
            { commentBody: commentBody },
            { new: true }
        );

        res.json(updatedComment);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete("/:commentId", validateToken, async (req, res) => {
    try {
        const commentId = req.params.commentId;
        await CommentModel.findByIdAndDelete(commentId);

        res.json("DELETED SUCCESSFULLY");
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
