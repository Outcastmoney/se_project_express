const clothingitem = require("../models/clothingitem");
const {
  STATUS_OK,
  STATUS_CREATED,
  STATUS_BAD_REQUEST,
  STATUS_NOT_FOUND,
  STATUS_INTERNAL_SERVER_ERROR,
} = require("../utils/constants");

const defaultUserId = "5d8b8592978f8bd833ca8133";

defaultUserId = "664e0b7e2b0b2c001f2e8b2d";

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;

  const owner = req.user && req.user._id ? req.user._id : defaultUserId;
  clothingitem
    .create({ name, weather, imageUrl, owner })
    .then((item) => {
      res.status(STATUS_CREATED).send({ data: item });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res
          .status(STATUS_BAD_REQUEST)
          .send({ message: "Invalid item data" });
      }
      return res
        .status(STATUS_INTERNAL_SERVER_ERROR)
        .send({ message: "Error creating item" });
    });
};

const getItems = (req, res) => {
  clothingitem
    .find({})
    .then((items) => {
      res.status(STATUS_OK).send(items);
    })
    .catch(() => {
      return res
        .status(STATUS_INTERNAL_SERVER_ERROR)
        .send({ message: "Error getting items" });
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;
  clothingitem
    .findByIdAndDelete(itemId)
    .orFail()
    .then((item) => {
      res.status(STATUS_OK).send({ data: item });
    })
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return res.status(STATUS_NOT_FOUND).send({ message: "Item not found" });
      }
      if (err.name === "CastError") {
        return res
          .status(STATUS_BAD_REQUEST)
          .send({ message: "Invalid item ID" });
      }
      return res
        .status(STATUS_INTERNAL_SERVER_ERROR)
        .send({ message: "Error deleting item" });
    });
};

const addLike = (req, res) => {
  const { itemId } = req.params;
  const userId = req.user && req.user._id ? req.user._id : defaultUserId;
  clothingitem
    .findByIdAndUpdate(itemId, { $addToSet: { likes: userId } }, { new: true })
    .orFail()
    .then((item) => {
      res.status(STATUS_OK).send({ data: item });
    })
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return res.status(STATUS_NOT_FOUND).send({ message: "Item not found" });
      }
      if (err.name === "CastError") {
        return res
          .status(STATUS_BAD_REQUEST)
          .send({ message: "Invalid item ID" });
      }
      return res
        .status(STATUS_INTERNAL_SERVER_ERROR)
        .send({ message: "Error adding like" });
    });
};

// Remove Like
const removeLike = (req, res) => {
  const { itemId } = req.params;
  const userId = req.user && req.user._id ? req.user._id : defaultUserId;
  clothingitem
    .findByIdAndUpdate(itemId, { $pull: { likes: userId } }, { new: true })
    .orFail()
    .then((item) => {
      res.status(STATUS_OK).send({ data: item });
    })
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return res.status(STATUS_NOT_FOUND).send({ message: "Item not found" });
      }
      if (err.name === "CastError") {
        return res
          .status(STATUS_BAD_REQUEST)
          .send({ message: "Invalid item ID" });
      }
      return res
        .status(STATUS_INTERNAL_SERVER_ERROR)
        .send({ message: "Error removing like" });
    });
};

module.exports = { createItem, getItems, deleteItem, addLike, removeLike };
