const { CustomError } = require('../../errors');

const errorHandler = (err, req, res, next) => {
  // Log the error for debugging purposes
  console.error(err);
  
  if (err instanceof CustomError) {
    return res.status(err.statusCode).send({
      message: err.message,
    });
  }
  
  // Handle mongoose validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).send({
      message: 'Validation Error',
      errors: Object.values(err.errors).map((e) => e.message),
    });
  }
  
  // Handle mongoose cast errors (invalid ObjectId)
  if (err.name === 'CastError') {
    return res.status(400).send({
      message: 'Invalid ID format',
    });
  }
  
  // Handle duplicate key errors (e.g., unique email constraint)
  if (err.code === 11000) {
    return res.status(409).send({
      message: 'Duplicate key error',
    });
  }

  // Default to 500 internal server error for unhandled errors
  const { statusCode = 500 } = err;
  return res.status(statusCode).send({
    message: statusCode === 500 ? 'An error occurred on the server' : err.message,
  });
};

module.exports = errorHandler;
