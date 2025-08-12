const router = require("express").Router();
// Items endpoints are public in Sprint 12 tests; no auth here

const { createItem, getItems, deleteItem, addLike, removeLike } = require("../controllers/clothingitem");

router.get("/", getItems);
router.post("/", createItem);
router.delete("/:itemId", deleteItem);
router.put("/:itemId/likes", addLike);
router.delete("/:itemId/likes", removeLike);

module.exports = router;
