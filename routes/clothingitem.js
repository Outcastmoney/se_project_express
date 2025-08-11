const router = require("express").Router();
const auth = require('../middlewares/auth');

const { createItem, getItems, deleteItem, addLike, removeLike } = require("../controllers/clothingitem");

// Public routes that don't require authentication
router.get("/", getItems);

// Protected routes that require authentication
router.post("/", auth, createItem);
router.delete("/:itemId", auth, deleteItem);
router.put("/:itemId/likes", auth, addLike);
router.delete("/:itemId/likes", auth, removeLike);

module.exports = router;
