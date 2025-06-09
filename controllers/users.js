const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const User = require("../models/user");
const {
  STATUS_OK,
  STATUS_CREATED,
  STATUS_BAD_REQUEST,
  STATUS_UNAUTHORIZED,
  STATUS_NOT_FOUND,
  STATUS_CONFLICT,
  STATUS_INTERNAL_SERVER_ERROR,
} = require("../utils/constants");



const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;

  if (!email || !password) {
    return res
      .status(STATUS_BAD_REQUEST)
      .send({ message: "Email and password are required" });
  }

  return bcrypt.hash(password, 10)
    .then((hashedPassword) =>
      User.create({ name, avatar, email, password: hashedPassword }),
    )
    .then((user) => {

      const userResponse = user.toObject();
      delete userResponse.password;
      return res.status(STATUS_CREATED).send(userResponse);
    })
    .catch((error) => {
      console.error(error);
      if (error.name === "ValidationError") {
        return res
          .status(STATUS_BAD_REQUEST)
          .send({ message: "Invalid user data provided." });
      }
      if (error.code === 11000) {
        return res
          .status(STATUS_CONFLICT)
          .send({ message: "User with this email already exists." });
      }
      return res
        .status(STATUS_INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server." });
    });
};

const getCurrentUser = (req, res) => {
  const userId = req.user._id;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(STATUS_NOT_FOUND).send({ message: "User not found" });
      }
      return res.status(STATUS_OK).send(user);
    })
    .catch((error) => {
      console.error(error);
      if (error.name === "CastError") {
        return res
          .status(STATUS_BAD_REQUEST)
          .send({ message: "Invalid user ID" });
      }
      return res
        .status(STATUS_INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server." });
    });
};

const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(STATUS_BAD_REQUEST)
      .send({ message: "Email and password are required" });
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {

      const token = jwt.sign(
        { _id: user._id },
        JWT_SECRET,
        { expiresIn: "7d" },
      );

      return res.status(STATUS_OK).send({ token });
    })
    .catch((err) => res.status(STATUS_UNAUTHORIZED).send({ message: err.message }));
};


const updateUserProfile = (req, res) => {
  const userId = req.user._id;
  const { name, avatar } = req.body;


  const updates = {};
  if (name) updates.name = name;
  if (avatar) updates.avatar = avatar;

  if (Object.keys(updates).length === 0) {
    return res.status(STATUS_BAD_REQUEST).send({ message: 'No fields to update provided.' });
  }

  return User.findByIdAndUpdate(
    userId,
    updates,
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        return res.status(STATUS_NOT_FOUND).send({ message: "User not found" });
      }
      return res.status(STATUS_OK).send(user);
    })
    .catch((error) => {
      console.error(error);
      if (error.name === "ValidationError") {
        return res
          .status(STATUS_BAD_REQUEST)
          .send({ message: "Invalid data provided for update." });
      }
      if (error.name === "CastError") {

        return res
          .status(STATUS_BAD_REQUEST)
          .send({ message: "Invalid user ID format." });
      }
      return res
        .status(STATUS_INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server while updating profile." });
    });
};

module.exports = {

  createUser,
  getCurrentUser,
  login,
  updateUserProfile,
};
