const router = require("express").Router();
const { getCurrentUser, updateUserProfile } = require("../controllers/users");
const { validateUserUpdate } = require("../middlewares/validation");

router.get("/", getCurrentUser);
router.patch("/", validateUserUpdate, updateUserProfile);

module.exports = router;
