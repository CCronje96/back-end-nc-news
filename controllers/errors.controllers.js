exports.handleServerErrors = (error, request, response, next) => {
  response.status(500).send({ message: "internal server error" });
};

exports.handlePsqlErrors = (error, request, response, next) => {
  if (error.code === "22P02") {
    response.status(400).send({ message: "bad request" });
  }
  next(error);
};

exports.handleCustomErrors = (error, request, response, next) => {
  if (error.code) {
    response.status(404).send({ message: "not found" });
  }
};
