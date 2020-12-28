const router = require("express").Router();

const { signup, login, googleAuth } = require("../controllers/authCtrl");

router.post("/signup", signup);
router.post("/login", login);
router.post("/saveGoogle", googleAuth);

module.exports = router;
