const ErrorHandler = (error, req, res) => {
  const statusCode = 500;
  const errorMessage = err.errorMsg;

  res.status(statusCode).send({ success: false, statusCode, errorMessage, error });
}

module.exports = ErrorHandler;
