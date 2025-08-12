const router = require("express").Router();
const clothingItem = require("./clothingitem");

const usersRouter = require("./users");
const auth = require('../middlewares/auth');
const { login, createUser } = require("../controllers/users");

// Public routes
router.post("/signin", login);
router.post("/signup", createUser);

// The items router is public for Sprint 12
router.use('/items', clothingItem);

// All subsequent routes are protected
router.use(auth);

router.use("/users", usersRouter);

const { STATUS_NOT_FOUND } = require("../utils/constants");

router.use((req, res) => {
  res.status(STATUS_NOT_FOUND).send({ message: "Not Found" });
});

module.exports = router;
