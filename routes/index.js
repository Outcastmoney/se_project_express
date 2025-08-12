const router = require("express").Router();
const clothingItem = require("./clothingitem");

const usersRouter = require("./users");
const auth = require('../middlewares/auth');
const { login, createUser, getUsers, getUserById } = require("../controllers/users");

// debug: log all requests reaching main router
router.use((req, res, next) => {
  // eslint-disable-next-line no-console
  console.log('[router]', req.method, req.originalUrl || req.url);
  next();
});

router.post("/signin", login);
router.post("/signup", createUser);

// Public users endpoints
router.post("/users", createUser);
router.get("/users", getUsers);
router.get("/users/:id", getUserById);

// Protected sub-routes for current user operations
router.use("/users", auth, usersRouter);
router.use('/items', clothingItem);

const { STATUS_NOT_FOUND } = require("../utils/constants");

router.use((req, res) => {
    res.status(STATUS_NOT_FOUND).send({ message: "Not Found" });
});

module.exports = router;