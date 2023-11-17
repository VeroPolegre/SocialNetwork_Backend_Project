const handleValidationErrors = (error, response) => {
  const errors = Object.values(error.errors).map((element) => element.message);

  if (errors.length > 1) {
    const errorMessages = errors.join(" && ");

    response.status(400).send({ messages: errorMessages });
  } else {
    response.status(400).send({ message: errors });
  }
};

const handleTypeError = (error, request, response, next) => {
  if (error.name === "ValidationError") {
    handleValidationErrors(error, response);
  } else if (error.code === 11000) {
    response.status(400).send("Email already in use");
  } else {
    // Use res.status(status).send(body) instead of res.send(status, body)
    response
      .status(500)
      .send({ error: "There was a problem", details: error.message });
  }
};

module.exports = { handleTypeError };
