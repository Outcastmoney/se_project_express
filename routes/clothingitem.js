const router = require("express").Router();

const { createItem, getItems, deleteItem, addLike, removeLike } = require("../controllers/clothingitem");

router.post("/", createItem);
router.get("/", getItems);
router.delete("/:itemId", deleteItem);
router.put("/:itemId/likes", addLike);
router.delete("/:itemId/likes", removeLike);

module.exports = router;
