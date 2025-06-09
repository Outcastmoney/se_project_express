const router = require("express").Router();
const { getCurrentUser, updateUserProfile } = require("../controllers/users");

router.get("/", (req, res) => {
  const User = require("../models/user");
  return User.find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => res.status(500).send({ message: err.message }));
});

router.get("/me", getCurrentUser);
router.patch("/me", updateUserProfile);

router.get("/:userId", (req, res) => {
  const { userId } = req.params;
  if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).send({ message: "Invalid user ID" });
  }
  
  const User = require("../models/user");
  return User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: "User not found" });
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(400).send({ message: "Invalid user ID" });
      }
      return res.status(500).send({ message: err.message });
    });
});

module.exports = router;
