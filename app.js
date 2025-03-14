const express = require("express");
const {
  handleServerErrors,
  handlePsqlErrors,
  handleCustomErrors,
} = require("./server/controllers/errors.controllers");
const apiRouter = require("./server/routes/api-router");
const app = express();

app.use(express.json());

app.use("/api", apiRouter);

app.all("*", (request, response, next) => {
  response.status(404).send({ message: "path not found" });
});

app.use(handlePsqlErrors);

app.use(handleCustomErrors);

app.use(handleServerErrors);

module.exports = app;
