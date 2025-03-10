const express = require("express");
const { getAllEndpoints } = require("./api.controllers");
const app = express();

app.get("/api", getAllEndpoints);

module.exports = app;
