const CustomError = require('./custom-error');

class ConflictError extends CustomError {
  constructor(message = 'Conflict') {
    super(message, 409);
  }
}

module.exports = ConflictError;
