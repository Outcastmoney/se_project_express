const router = require("express").Router();
const clothingItem = require("./clothingitem");

const usersRouter = require("./users");
const auth = require('../middlewares/auth');
const { login, createUser } = require("../controllers/users");

router.post("/signin", login);
router.post("/users", createUser);
router.use("/users", auth, usersRouter);
router.use('/items', clothingItem);

const { STATUS_NOT_FOUND } = require("../utils/constants");

router.use((req, res) => {
    res.status(STATUS_NOT_FOUND).send({ message: "Not Found" });
});

module.exports = router;