exports.handleServerErrors = (error, request, response, next) => {
  console.log("Server Error:", error);
  response.status(500).send({ message: "internal server error" });
};
