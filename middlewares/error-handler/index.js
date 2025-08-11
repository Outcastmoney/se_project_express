const { CustomError } = require('../../errors');

// eslint-disable-next-line no-unused-vars
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
  return res.status(500).send({
    message: 'Internal server error',
  });
};

module.exports = errorHandler;
