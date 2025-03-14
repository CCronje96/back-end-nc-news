const { getUsers, getUserByName } = require("../controllers/users.controllers");

const usersRouter = require("express").Router();

usersRouter.get("/", getUsers);

usersRouter.get("/:username", getUserByName);

module.exports = usersRouter;
