const router = require("express").Router();
const auth = require('../middlewares/auth');

const { createItem, getItems, deleteItem, addLike, removeLike } = require("../controllers/clothingitem");

router.post("/", createItem);
router.get("/", getItems);

// Apply auth middleware to protected routes
router.use(auth);
router.delete("/:itemId", deleteItem);
router.put("/:itemId/likes", addLike);
router.delete("/:itemId/likes", removeLike);

module.exports = router;
