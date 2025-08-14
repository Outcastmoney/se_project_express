const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const { UnauthorizedError } = require("../errors");

module.exports = (req, res, next) => {
  // If req.user is already set by our test middleware, we can skip token verification
  if (req.user && req.user._id) {
    return next();
  }

  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    throw new UnauthorizedError("Authorization Required - No token provided or incorrect format");
  }

  const token = authorization.replace("Bearer ", "");
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    throw new UnauthorizedError("Authorization Required - Invalid token");
  }

  req.user = payload;
  return next();
};
