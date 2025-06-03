const clothingitem = require("../models/clothingitem");

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;

  clothingitem
    .create({ name, weather, imageUrl })
    .then((item) => {
      console.log(item);
      res.send({ data: item });
    })
    .catch((e) => {
      res.status(500).send({ message: "error from createItem", e });
    });
};

const getItems = (req, res) => {
  clothingitem
    .find({})
    .then((items) => {
      res.status(200).send(items);
    })
    .catch((e) => {
      res.status(500).send({ message: "error from getItems", e });
    });
};

const updateItem = (req, res) => {
  const { itemId } = req.params;
  const { imageUrl } = req.body;

  clothingitem
    .findByIdAndUpdate(itemId, { $set: { imageUrl } })
    .orFail()
    .then((item) => {
      res.status(200).send({ data: item });
    })
    .catch((e) => {
      res.status(500).send({ message: "error from updateItem", e });
    });
};
const deleteItem = (req, res) => {
  const { itemId } = req.params;

  clothingitem
    .findByIdAndDelete(itemId)
    .orFail()
    .then((item) => {
      res.status(200).send({ data: item });
    })
    .catch((e) => {
      res.status(500).send({ message: "error from deleteItem", e });
    });
};

module.exports = { createItem, getItems, updateItem, deleteItem };
