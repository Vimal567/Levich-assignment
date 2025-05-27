const Comment = require('../models/comment.model');

// Get all comments
const getComments = async (req, res) => {
  try {
    const comments = await Comment.find().populate('user', 'name email permissions');
    res.status(200).json({ success: true, comments });
  } catch (error) {
    console.error("Get comments error:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

// Add a comment
const addComment = async (req, res) => {
  const { text } = req.body;

  try {
    const comment = await Comment.create({
      text,
      user: req.user.userId
    });

    res.status(201).json({ success: true, comment });
  } catch (error) {
    console.error("Add comment error:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

// Delete a comment (global delete rights)
const deleteComment = async (req, res) => {
  const { commentId } = req.params;

  try {
    const comment = await Comment.findByIdAndDelete(commentId);

    if (!comment) {
      return res.status(404).json({ success: false, message: "Comment not found." });
    }

    res.status(200).json({ success: true, message: "Comment deleted." });
  } catch (error) {
    console.error("Delete comment error:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

module.exports = { getComments, addComment, deleteComment };
