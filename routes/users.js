const router = require("express").Router();
const { getCurrentUser, updateUserProfile } = require("../controllers/users");

router.get("/me", getCurrentUser);
router.patch("/me", updateUserProfile);

module.exports = router;
