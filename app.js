const express = require("express");
const { getAllEndpoints } = require("./controllers/api.controllers");
const { handleServerErrors } = require("./controllers/errors.controllers");
const { getAllTopics } = require("./controllers/topics.controllers");
const { getArticleById } = require("./controllers/articles.controllers");
const app = express();

app.get("/api", getAllEndpoints);

app.get("/api/topics", getAllTopics);

app.get("/api/articles/:article_id", getArticleById);

app.all("*", (request, response, next) => {
  response.status(404).send({ message: "path not found" });
});

app.use(handleServerErrors);

module.exports = app;
