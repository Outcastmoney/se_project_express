const router = require("express").Router();
const clothingItem = require("./clothingitem");

const usersRouter = require("./users");
const auth = require("../middlewares/auth");
const { login, createUser } = require("../controllers/users");
const { validateUserLogin, validateUserCreate } = require("../middlewares/validation");

router.post("/signin", validateUserLogin, login);
router.post("/signup", validateUserCreate, createUser);

router.use("/users", auth, usersRouter);
router.use("/items", clothingItem);

const { NotFoundError } = require("../errors");

router.use((req, res, next) => {
  next(new NotFoundError("Not Found"));
});

module.exports = router;
