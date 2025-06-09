const clothingitem = require("../models/clothingitem");
const {
  STATUS_OK,
  STATUS_CREATED,
  STATUS_BAD_REQUEST,
  STATUS_FORBIDDEN,
  STATUS_NOT_FOUND,
  STATUS_INTERNAL_SERVER_ERROR,
} = require("../utils/constants");


const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;

  if (!name || !weather || !imageUrl) {
    return res.status(STATUS_BAD_REQUEST).send({ message: "Invalid item data" });
  }

  return clothingitem
    .create({ name, weather, imageUrl, owner: req.user._id })
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
    .catch(() =>
      res
        .status(STATUS_INTERNAL_SERVER_ERROR)
        .send({ message: "Error getting items" })
    );
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;
  const userId = req.user._id;

  clothingitem.findById(itemId)
    .orFail(() => {
      const error = new Error("Item not found");
      error.statusCode = STATUS_NOT_FOUND;
      error.name = "DocumentNotFoundError";
      throw error;
    })
    .then((item) => {
      if (item.owner.toString() !== userId) {
        const error = new Error("Forbidden: You can only delete your own items.");
        error.statusCode = STATUS_FORBIDDEN;
        throw error;
      }
      return clothingitem.findByIdAndDelete(itemId)
        .orFail();
    })
    .then((deletedItem) => {
      res.status(STATUS_OK).send({ data: deletedItem });
    })
    .catch((err) => {
      if (err.statusCode === STATUS_NOT_FOUND || err.name === "DocumentNotFoundError") {
        return res.status(STATUS_NOT_FOUND).send({ message: err.message || "Item not found" });
      }
      if (err.statusCode === STATUS_FORBIDDEN) {
        return res.status(STATUS_FORBIDDEN).send({ message: err.message });
      }
      if (err.name === "CastError") {
        return res
          .status(STATUS_BAD_REQUEST)
          .send({ message: "Invalid item ID" });
      }
      console.error("Error in deleteItem:", err);
      return res
        .status(STATUS_INTERNAL_SERVER_ERROR)
        .send({ message: "Error deleting item" });
    });
};

const addLike = (req, res) => {
  const { itemId } = req.params;
  const userId = req.user._id;
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


const removeLike = (req, res) => {
  const { itemId } = req.params;
  const userId = req.user._id;
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
