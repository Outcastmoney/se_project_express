const router = require("express").Router();
const { getCurrentUser, updateUserProfile, getUsers, getUserById } = require("../controllers/users");

router.get("/me", getCurrentUser);
router.patch("/me", updateUserProfile);
router.get("/", getUsers);
router.get("/:userId", getUserById);

module.exports = router;
