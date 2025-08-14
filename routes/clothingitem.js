const router = require("express").Router();
const auth = require("../middlewares/auth");
const { validateItemCreate, validateItemId } = require("../middlewares/validation");

const {
  createItem,
  getItems,
  deleteItem,
  addLike,
  removeLike,
} = require("../controllers/clothingitem");

router.post("/", auth, validateItemCreate, createItem);
router.get("/", getItems);

router.use(auth);
router.delete("/:itemId", validateItemId, deleteItem);
router.put("/:itemId/likes", validateItemId, addLike);
router.delete("/:itemId/likes", validateItemId, removeLike);

module.exports = router;
