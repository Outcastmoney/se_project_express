const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../utils/config');
const { STATUS_UNAUTHORIZED } = require('../utils/constants'); // Assuming you have this constant

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(STATUS_UNAUTHORIZED).send({ message: 'Authorization Required - No token provided or incorrect format' });
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    console.error('Token verification error:', err.name, err.message); // Added for debugging
    return res.status(STATUS_UNAUTHORIZED).send({ message: 'Authorization Required - Invalid token' });
  }

  req.user = payload; // Assign the payload to the request user object
  return next(); // Pass the request to the next middleware or route handler
};
