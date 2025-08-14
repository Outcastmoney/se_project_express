const router = require("express").Router();
const { getCurrentUser, updateUserProfile } = require("../controllers/users");
const { validateUserUpdate } = require("../middlewares/validation");

router.get("/me", getCurrentUser);
router.patch("/me", validateUserUpdate, updateUserProfile);

module.exports = router;
