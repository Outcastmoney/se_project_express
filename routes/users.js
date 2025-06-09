const router = require("express").Router();
const { getCurrentUser, updateUserProfile } = require("../controllers/users"); // Import getCurrentUser and updateUserProfile

// router.get("/", getUsers); // Removed as per requirements
router.get("/me", getCurrentUser); // Route to get current user's info
router.patch("/me", updateUserProfile); // Route to update current user's profile
// router.post("/", createUser); // Moved to /signup in index.js



module.exports = router;
