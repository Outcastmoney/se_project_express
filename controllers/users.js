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

  const userData = { name, avatar }; // name and avatar are still required by schema

  // Only add email to userData if it's provided
  if (email !== undefined) {
    userData.email = email;
  }

  const processUserCreation = (hashedPassword) => {
    if (hashedPassword !== undefined) {
      userData.password = hashedPassword;
    }

    return User.create(userData)
      .then((user) => {
        const userResponse = user.toObject();
        // Ensure password is not sent back, even if it was just created (and is undefined if not provided)
        if (userResponse.password !== undefined) {
          delete userResponse.password;
        }
        return res.status(STATUS_CREATED).send(userResponse);
      })
      .catch((error) => {
        console.error(error);
        if (error.name === "ValidationError") {
          const messages = Object.values(error.errors).map(err => err.message);
          return res
            .status(STATUS_BAD_REQUEST)
            .send({ message: messages.join('. ') + (messages.length > 0 ? '.' : '') });
        }
        if (error.code === 11000 && email) { // Check email for 11000 only if email was part of the attempt
          return res
            .status(STATUS_CONFLICT)
            .send({ message: "User with this email already exists." });
        }
        // This specific bcrypt error check might be less relevant if password hashing is conditional
        // but kept for robustness if password is provided but is of an invalid type for bcrypt.
        if (password && error.message && error.message.includes("data and salt arguments required")) {
          return res.status(STATUS_BAD_REQUEST).send({ message: "Invalid password data for hashing." });
        }
        return res
          .status(STATUS_INTERNAL_SERVER_ERROR)
          .send({ message: "An error has occurred on the server." });
      });
  };

  if (password) {
    bcrypt.hash(password, 10)
      .then(hashedPassword => processUserCreation(hashedPassword))
      .catch(error => {
        // Handle bcrypt hashing specific errors before attempting user creation
        console.error("Bcrypt hashing error:", error);
        return res.status(STATUS_BAD_REQUEST).send({ message: "Error processing password." });
      });
  } else {
    // If no password provided, proceed directly to user creation without hashing
    processUserCreation(undefined);
  }
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
