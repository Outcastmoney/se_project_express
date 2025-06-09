const router = require("express").Router();
const auth = require('../middlewares/auth');

const { createItem, getItems, deleteItem, addLike, removeLike } = require("../controllers/clothingitem");

router.post("/", auth, createItem);
router.get("/", getItems);

router.use(auth);
router.delete("/:itemId", deleteItem);
router.put("/:itemId/likes", addLike);
router.delete("/:itemId/likes", removeLike);

module.exports = router;
