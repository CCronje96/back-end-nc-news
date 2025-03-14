const { selectAllData } = require("../models/topics.models");

exports.getAllTopics = (request, response, next) => {
  selectAllData().then((topics) => {
    response.status(200).send({ topics: topics });
  });
};

// receive the request
// extract necessary info
// invoke the model
// sends back the response
