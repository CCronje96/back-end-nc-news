const express = require("express");
const { getAllEndpoints } = require("./controllers/api.controllers");
const {
  handleServerErrors,
  handlePsqlErrors,
  handleCustomErrors,
} = require("./controllers/errors.controllers");
const { getAllTopics } = require("./controllers/topics.controllers");
const {
  getArticleById,
  getAllArticles,
  getCommentsByArticleId,
  postCommentByArticleId,
  patchArticleById,
} = require("./controllers/articles.controllers");
const { removeCommentById } = require("./controllers/comments.controllers");
const { getUsers } = require("./controllers/users.controllers");
const app = express();

app.use(express.json());

app.get("/api", getAllEndpoints);

app.get("/api/topics", getAllTopics);

app.get("/api/articles", getAllArticles);

app.get("/api/users", getUsers);

app.get("/api/articles/:article_id", getArticleById);

app.patch("/api/articles/:article_id", patchArticleById);

app.get("/api/articles/:article_id/comments", getCommentsByArticleId);

app.post("/api/articles/:article_id/comments", postCommentByArticleId);

app.delete("/api/comments/:comment_id", removeCommentById);

app.all("*", (request, response, next) => {
  response.status(404).send({ message: "path not found" });
});

app.use(handlePsqlErrors);

app.use(handleCustomErrors);

app.use(handleServerErrors);

module.exports = app;
