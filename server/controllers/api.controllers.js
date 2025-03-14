const endpoints = require("../../endpoints.json");

exports.getAllEndpoints = (request, response, next) => {
  response.status(200).send({ endpoints: endpoints });
};
