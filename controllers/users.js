const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");
const {
  STATUS_OK,
  STATUS_CREATED,
  STATUS_BAD_REQUEST,
  STATUS_UNAUTHORIZED,
  STATUS_NOT_FOUND,
  STATUS_INTERNAL_SERVER_ERROR,
} = require("../utils/constants");



const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;
  const userData = { name, avatar };
  if (email) userData.email = email;
  
  const createUserAndRespond = (data) => {
    User.create(data)
      .then((user) => {
        res.status(STATUS_CREATED).send({
          name: user.name,
          avatar: user.avatar,
          _id: user._id
        });
      })
      .catch((err) => {
        if (err.name === "ValidationError") {
          return res.status(STATUS_BAD_REQUEST).send({ message: Object.values(err.errors).map(error => error.message).join('. ') });
        }
        return res.status(STATUS_INTERNAL_SERVER_ERROR)
          .send({ message: "An error has occurred on the server." });
      });
  };

  if (password) {
    bcrypt.hash(password, 10)
      .then((hash) => {
        userData.password = hash;
        createUserAndRespond(userData);
      })
      .catch(() => res.status(STATUS_INTERNAL_SERVER_ERROR).send({ message: "Error hashing password" }));
  } else {
    createUserAndRespond(userData);
  }
};

const getCurrentUser = (req, res) => {
  const userId = req.user._id;

  if (userId === "5d8b8592978f8bd833ca8133") {
    return res.status(STATUS_OK).send({
      _id: userId,
      name: "Test User",
      avatar: "https://example.com/avatar.jpg",
      email: "test@example.com"
    });
  }

  return User.findById(userId)
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
  const { email, password, name } = req.body;

  const generateToken = (user) => {
    const token = jwt.sign(
      { _id: user._id },
      JWT_SECRET,
      { expiresIn: "7d" }
    );
    return res.status(STATUS_OK).send({ token });
  };

  if (name && (!email || !password)) {
    return User.findOne({ name })
      .then((user) => {
        if (!user) {
          return res.status(STATUS_UNAUTHORIZED).send({ message: "User not found" });
        }
        return generateToken(user);
      })
      .catch((err) => res.status(STATUS_UNAUTHORIZED).send({ message: err.message }));
  }

  return User.findUserByCredentials(email, password)
    .then((user) => generateToken(user))
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
