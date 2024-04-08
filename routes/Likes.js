const express = require("express");
const router = express.Router();
const LikeModel = require("../models/Likes");
const { validateToken } = require("../middlewares/AuthMiddleware");

router.post("/", validateToken, async (req, res) => {
    const { postId } = req.body;
    const userId = req.user.id;

    try {
        const found = await LikeModel.findOne({
            postId: postId,
            userId: userId
        });

        if (!found) {
            await LikeModel.create({ postId: postId, userId: userId });
            res.json({ liked: true });
        } else {
            await LikeModel.deleteOne({
                postId: postId,
                userId: userId
            });
            res.json({ liked: false });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
