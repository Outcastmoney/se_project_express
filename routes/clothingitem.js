const router = require("express").Router();
const auth = require('../middlewares/auth');

const { createItem, getItems, deleteItem, addLike, removeLike } = require("../controllers/clothingitem");

router.post("/", createItem);
router.get("/", getItems);
router.delete("/:itemId", auth, deleteItem);
router.put("/:itemId/likes", auth, addLike);
router.delete("/:itemId/likes", auth, removeLike);

module.exports = router;
