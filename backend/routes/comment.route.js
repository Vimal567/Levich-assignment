const express = require("express");
const {
  getComments,
  addComment,
  deleteComment,
} = require("../controllers/comment.controller");
const authMiddleware = require("../middleware/auth.middleware");
const { commentMiddleware } = require("../middleware/comment.middleware");

const router = express.Router();

router.get("/", authMiddleware, commentMiddleware("read"), getComments);
router.post("/", authMiddleware, commentMiddleware("write"), addComment);
router.delete("/:commentId", authMiddleware, deleteComment); //global delete rights

module.exports = router;
