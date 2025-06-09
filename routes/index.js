const router = require("express").Router();
const clothingItem = require("./clothingitem");

const usersRouter = require("./users");
const auth = require('../middlewares/auth'); // Import auth middleware
const { login, createUser } = require("../controllers/users"); // Import controllers for signin/signup

router.post("/signin", login);
router.post("/signup", createUser);
router.use("/users", auth, usersRouter); // Protect all /users routes
router.use('/items', clothingItem);

const { STATUS_NOT_FOUND } = require("../utils/constants");

router.use((req, res) => {
    res.status(STATUS_NOT_FOUND).send({ message: "Not Found" });
});

module.exports = router;