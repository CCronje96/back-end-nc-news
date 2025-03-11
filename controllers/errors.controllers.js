exports.handleServerErrors = (error, request, response, next) => {
  response.status(500).send({ message: "internal server error" });
};

exports.handlePsqlErrors = (error, request, response, next) => {
  const psqlErrors = ["22P02", "23502", "23503", "22001"];
  if (psqlErrors.includes(error.code)) {
    response.status(400).send({ message: "bad request" });
  } else next(error);
};

exports.handleCustomErrors = (error, request, response, next) => {
  if (error.status) {
    response.status(error.status).send({ message: error.message });
  } else next(error);
};
