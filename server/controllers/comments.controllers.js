const {
  deleteCommentById,
  updateCommentById,
} = require("../models/comments.models");
const { checkExists } = require("../../utils");

exports.removeCommentById = (request, response, next) => {
  const { comment_id } = request.params;
  checkExists("comments", "comment_id", comment_id)
    .then(() => {
      deleteCommentById(comment_id);
    })
    .then(() => {
      response.status(204).send();
    })
    .catch((error) => {
      next(error);
    });
};

exports.patchCommentById = (request, response, next) => {
  const { comment_id } = request.params;
  const { inc_votes } = request.body;

  const promises = [updateCommentById(comment_id, inc_votes)];
  promises.push(checkExists("comments", "comment_id", comment_id));

  Promise.all(promises)
    .then(([updatedComment]) => {
      response.status(200).send({ updatedComment: updatedComment });
    })
    .catch((error) => {
      next(error);
    });
};
