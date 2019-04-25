const express = require("express");
const router = express.Router();
const validation = require("./validation");
const userController = require("../controllers/userController")

router.get("/users/signup", userController.signUpForm);
router.post('/users', validation.validateUsers, userController.signUp)

module.exports = router;