const router = require("express").Router();
const { getCurrentUser, updateUserProfile, getUsers, getUserById } = require("../controllers/users");

// Route to get the current user
router.get("/me", getCurrentUser);
router.patch("/me", updateUserProfile);

// Route to get all users
router.get("/", getUsers);

// Route to get a specific user by ID
router.get("/:userId", getUserById);

module.exports = router;
