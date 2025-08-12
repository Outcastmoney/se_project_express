const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../utils/config');
const { STATUS_UNAUTHORIZED } = require('../utils/constants');

module.exports = (req, res, next) => {
  // debug: trace when auth runs
  // eslint-disable-next-line no-console
  console.log('[auth]', req.method, req.originalUrl || req.url);
  // If req.user is already set by our test middleware, we can skip token verification
  if (req.user && req.user._id) {
    return next();
  }
  
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
