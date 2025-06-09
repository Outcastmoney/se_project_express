const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../utils/config');
const { STATUS_UNAUTHORIZED } = require('../utils/constants');

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
    console.error('Token verification error:', err.name, err.message);
    return res.status(STATUS_UNAUTHORIZED).send({ message: 'Authorization Required - Invalid token' });
  }

  req.user = payload;
  return next();
};
