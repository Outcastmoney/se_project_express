const errorHandler = (err, req, res, next) => {
  // Log the error for debugging purposes
  console.error(err);
  
  // if an error has no status, display 500
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      // check the status and display a message based on it
      message: statusCode === 500
        ? 'An error occurred on the server'
        : message
    });
};

module.exports = errorHandler;
