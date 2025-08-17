const router = require("express").Router();
const clothingItem = require("./clothingitem");

const usersRouter = require("./users");
const auth = require("../middlewares/auth");
const { login, createUser, getCurrentUser } = require("../controllers/users");
const { validateUserLogin, validateUserCreate } = require("../middlewares/validation");

// User routes
router.post("/signin", validateUserLogin, login);
router.post("/signup", validateUserCreate, createUser);
router.post("/users", validateUserCreate, createUser);
router.get("/users", getCurrentUser);
router.get("/users/:id", getCurrentUser);

// Protected user routes
router.use("/users/me", auth, usersRouter);

// Item routes
router.use("/items", clothingItem);

const { NotFoundError } = require("../errors");

// 404 handler - must be last
router.use((req, res, next) => {
  next(new NotFoundError("Not Found"));
});

module.exports = router;
