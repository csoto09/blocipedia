const express = require("express");
const router = express.Router();
const validation = require("./validation");
const userController = require("../controllers/userController")

router.get("/users/signup", userController.signUpForm);
router.post('/users', validation.validateUsers, userController.signUp)
router.get("/users/sign_in", userController.signInForm);
 router.post("/users/sign_in", validation.validateUsers, userController.signIn);
 router.get("/users/sign_out", userController.signOut);

module.exports = router;