const clothingitem = require("../models/clothingitem");
const {
  BadRequestError,
  NotFoundError,
  ForbiddenError
} = require("../errors");
const {
  STATUS_OK,
  STATUS_CREATED
} = require("../utils/constants");

const createItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;

  if (!name || !weather || !imageUrl) {
    return next(new BadRequestError("Invalid item data"));
  }

  return clothingitem
    .create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => {
      res.status(STATUS_CREATED).send({ data: item });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return next(new BadRequestError("Invalid item data"));
      }
      return next(err);
    });
};

const getItems = (req, res, next) => {
  clothingitem
    .find({})
    .then((items) => {
      res.status(STATUS_OK).send(items);
    })
    .catch((err) => next(err));
};

const deleteItem = (req, res, next) => {
  const { itemId } = req.params;
  const userId = req.user._id;

  clothingitem
    .findById(itemId)
    .orFail(() => {
      throw new NotFoundError("Item not found");
    })
    .then((item) => {
      if (item.owner.toString() !== userId) {
        throw new ForbiddenError("You can only delete your own items.");
      }
      return clothingitem.findByIdAndDelete(itemId).orFail();
    })
    .then((deletedItem) => {
      res.status(STATUS_OK).send({ data: deletedItem });
    })
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError(err.message || "Item not found"));
      }
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid item ID"));
      }
      return next(err);
    });
};

const addLike = (req, res, next) => {
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
        return next(new NotFoundError("Item not found"));
      }
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid item ID"));
      }
      return next(err);
    });
};

const removeLike = (req, res, next) => {
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
        return next(new NotFoundError("Item not found"));
      }
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid item ID"));
      }
      return next(err);
    });
};

module.exports = { createItem, getItems, deleteItem, addLike, removeLike };
