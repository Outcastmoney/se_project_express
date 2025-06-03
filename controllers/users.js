const User = require("../models/user");
const {
  STATUS_OK,
  STATUS_CREATED,
  STATUS_BAD_REQUEST,
  STATUS_NOT_FOUND,
  STATUS_INTERNAL_SERVER_ERROR,
} = require("../utils/constants");

const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.status(STATUS_OK).send(users);
    })
    .catch((error) => {
      console.log(error);
      return res.status(STATUS_INTERNAL_SERVER_ERROR).send({ message: "An error has occurred on the server." });
    });
};

const createUser = (req, res) => {
  const { name, avatar } = req.body;

  User.create({ name, avatar })
    .then((user) => {
      res.status(STATUS_CREATED).send(user);
    })
    .catch((error) => {
      console.log(error);
      if (error.name === "ValidationError") {
        return res.status(STATUS_BAD_REQUEST).send({ message: "Invalid user data" });
      }
      return res.status(STATUS_INTERNAL_SERVER_ERROR).send({ message: "An error has occurred on the server." });
    });
};

const getUser = (req, res) => {
  const { userId } = req.params;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(STATUS_NOT_FOUND).send({ message: "User not found" });
      }
      return res.status(STATUS_OK).send(user);
    })
    .catch((error) => {
      console.log(error);
      if (error.name === "DocumentNotFoundError") {
        return res.status(STATUS_NOT_FOUND).send({ message: "User not found" });
      } else if (error.name === "CastError") {
        return res.status(STATUS_BAD_REQUEST).send({ message: "Invalid user ID" });
      }
      return res.status(STATUS_INTERNAL_SERVER_ERROR).send({ message: "An error has occurred on the server." });
    });
};

module.exports = { getUsers, createUser, getUser };
