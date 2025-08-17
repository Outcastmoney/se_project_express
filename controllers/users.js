const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");
const { 
  BadRequestError, 
  NotFoundError, 
  ConflictError,
  UnauthorizedError 
} = require("../errors");
const { 
  STATUS_OK,
  STATUS_CREATED 
} = require("../utils/constants");

const createUser = (req, res, next) => {
  const { name, avatar, email, password } = req.body;

  if (!name) {
    return next(new BadRequestError("Name is required"));
  }

  if (name.length < 2 || name.length > 30) {
    return next(new BadRequestError("Name must be between 2 and 30 characters"));
  }

  if (!avatar) {
    return next(new BadRequestError("Avatar URL is required"));
  }

  if (!validator.isURL(avatar)) {
    return next(new BadRequestError("Avatar URL must be valid"));
  }

  const userData = { name, avatar, email };

  const createUserAndRespond = (data) => {
    User.create(data)
      .then((user) => {
        res.status(STATUS_CREATED).send({
          name: user.name,
          avatar: user.avatar,
          email: user.email,
          _id: user._id,
        });
      })
      .catch((err) => {
        if (err.code === 11000) {
          return next(new ConflictError("Email already exists"));
        }
        if (err.name === "ValidationError") {
          return next(new BadRequestError(Object.values(err.errors)
            .map((error) => error.message)
            .join(". ")));
        }
        return next(err);
      });
  };

  if (password) {
    return bcrypt
      .hash(password, 10)
      .then((hash) => {
        userData.password = hash;
        return createUserAndRespond(userData);
      })
      .catch((err) => next(err));
  }
  return createUserAndRespond(userData);
};

const getCurrentUser = (req, res, next) => {
  const userId = req.user._id;

  if (!userId) {
    return User.find({})
      .then((users) => res.status(STATUS_OK).send(users))
      .catch((err) => next(err));
  }

  return User.findById(userId)
    .then((user) => {
      if (!user) {
        return next(new NotFoundError("User not found"));
      }
      return res.status(STATUS_OK).send(user);
    })
    .catch((error) => {
      if (error.name === "CastError") {
        return next(new BadRequestError("Invalid user ID"));
      }
      return next(error);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  const generateToken = (user) => {
    const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: "7d" });
    return res.status(STATUS_OK).send({ token });
  };

  return User.findUserByCredentials(email, password)
    .then((user) => generateToken(user))
    .catch((err) => {
      if (err.message === "Incorrect email or password") {
        return next(new UnauthorizedError("Incorrect email or password"));
      }
      return next(err);
    });
};

const updateUserProfile = (req, res, next) => {
  const userId = req.user._id;
  const { name, avatar } = req.body;

  const updates = {};
  if (name) updates.name = name;
  if (avatar) updates.avatar = avatar;

  if (Object.keys(updates).length === 0) {
    return next(new BadRequestError("No fields to update provided."));
  }

  return User.findByIdAndUpdate(userId, updates, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      if (!user) {
        return next(new NotFoundError("User not found"));
      }
      return res.status(STATUS_OK).send(user);
    })
    .catch((error) => {
      if (error.name === "ValidationError") {
        return next(new BadRequestError("Invalid data provided for update."));
      }
      if (error.name === "CastError") {
        return next(new BadRequestError("Invalid user ID format."));
      }
      return next(error);
    });
};

module.exports = {
  createUser,
  getCurrentUser,
  login,
  updateUserProfile,
};
