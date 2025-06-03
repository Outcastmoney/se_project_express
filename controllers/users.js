const user = require("../models/user");

const getUsers = (req, res) => {
  user.find({})
    .then((users) => {
      res.status(200).send(users);
    })
    .catch((error) => {
      console.log(error);
      return res.status(500).send({ message: error.message });
    });
};

const createUser = (req, res) => {
  const { name, avatar } = req.body;

  user.create({ name, avatar })
    .then((user) => {
      res.status(201).send(user);
    })
    .catch((error) => {
      console.log(error);
      return res.status(500).send({ message: error.message });
    });
}

module.exports = { getUsers, createUser };