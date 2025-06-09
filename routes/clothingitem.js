const router = require("express").Router();
const auth = require('../middlewares/auth'); // Import auth middleware

const { createItem, getItems, deleteItem, addLike, removeLike } = require("../controllers/clothingitem");

router.post("/", auth, createItem); // Protect createItem
router.get("/", getItems); // getItems is public
router.delete("/:itemId", auth, deleteItem); // Protect deleteItem
router.put("/:itemId/likes", auth, addLike); // Protect addLike
router.delete("/:itemId/likes", auth, removeLike); // Protect removeLike

module.exports = router;
