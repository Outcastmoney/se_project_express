const router = require("express").Router();
const clothingItem = require("./clothingitem");

const usersRouter = require("./users");
const auth = require('../middlewares/auth');
const { login, createUser, getCurrentUser } = require("../controllers/users");

router.post("/signin", login);
router.post("/signup", createUser);

router.post("/users", createUser);
router.get("/users", getCurrentUser);
router.get("/users/:userId", getCurrentUser);

router.use("/users", auth, usersRouter);
router.use('/items', clothingItem);

const { STATUS_NOT_FOUND } = require("../utils/constants");

router.use((req, res) => {
    res.status(STATUS_NOT_FOUND).send({ message: "Not Found" });
});

module.exports = router;