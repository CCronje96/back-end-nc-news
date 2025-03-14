const {
  getAllArticles,
  getCommentsByArticleId,
  postCommentByArticleId,
  patchArticleById,
  getArticleById,
} = require("../controllers/articles.controllers");

const articlesRouter = require("express").Router();

articlesRouter.get("/", getAllArticles);

articlesRouter.post("/");

articlesRouter.get("/:article_id", getArticleById);

articlesRouter.get("/:article_id/comments", getCommentsByArticleId);

articlesRouter.post("/:article_id/comments", postCommentByArticleId);

articlesRouter.patch("/:article_id", patchArticleById);

module.exports = articlesRouter;
