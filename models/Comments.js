const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  commentBody: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: true,
  },
});

const CommentModel = mongoose.model('Comment', commentSchema);

module.exports = CommentModel;
