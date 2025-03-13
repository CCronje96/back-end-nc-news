const { selectUsers, selectUserByName } = require("../models/users.models");
const { checkExists } = require("../utils");

exports.getUsers = (request, response, next) => {
  selectUsers().then((users) => {
    response.status(200).send({ users: users });
  });
};

exports.getUserByName = (request, response, next) => {
  const { username } = request.params;
  const promises = [selectUserByName(username)];
  promises.push(checkExists("users", "username", username));

  Promise.all(promises)
    .then(([user]) => {
      response.status(200).send({ user: user });
    })
    .catch((error) => {
      next(error);
    });
};
