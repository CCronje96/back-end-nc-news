const { deleteCommentById } = require("../models/comments.models");
const { checkExists } = require("../utils");

exports.removeCommentById = (request, response, next) => {
  const { comment_id } = request.params;
  checkExists("comments", "comment_id", comment_id)
    .then(() => {
      deleteCommentById(comment_id);
    })
    .then(() => {
      response.status(204).end();
    })
    .catch((error) => {
      next(error);
    });
};
