const CustomError = require('./custom-error');

class BadRequestError extends CustomError {
  constructor(message = 'Bad request') {
    super(message, 400);
  }
}

module.exports = BadRequestError;
