const {
  removeCommentById,
  patchCommentById,
} = require("../controllers/comments.controllers");

const commentsRouter = require("express").Router();

commentsRouter.patch("/:comment_id", patchCommentById);

commentsRouter.delete("/:comment_id", removeCommentById);

module.exports = commentsRouter;
