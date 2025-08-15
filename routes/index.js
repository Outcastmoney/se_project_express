const router = require("express").Router();
const clothingItem = require("./clothingitem");

const usersRouter = require("./users");
const auth = require("../middlewares/auth");
const { login, createUser, getCurrentUser } = require("../controllers/users");
const { validateUserLogin, validateUserCreate } = require("../middlewares/validation");

router.post("/signin", validateUserLogin, login);
router.post("/signup", validateUserCreate, createUser);
router.get("/users", getCurrentUser);
router.use("/items", clothingItem);

router.use("/users/me", auth, usersRouter);

const { NotFoundError } = require("../errors");

// 404 handler
router.use((req, res, next) => {
  next(new NotFoundError("Not Found"));
});

module.exports = router;
