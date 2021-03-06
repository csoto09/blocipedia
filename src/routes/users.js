const express = require("express");
const router = express.Router();
const validation = require("./validation");
const userController = require("../controllers/userController")

router.get("/users/signup", userController.signUpForm);
router.post('/users/signup', validation.validateUsers, userController.signUp)
router.get("/users/sign_in", userController.signInForm);
router.post("/users/sign_in", validation.validateUsers, userController.signIn);
router.get("/users/sign_out", userController.signOut);
router.get('/users/:id', userController.profile)
router.get('/users/:id/checkout', userController.checkout)
router.post('/users/:id/upgradeAccount', userController.upgradeAccount)
router.get('/users/:id/downgradeAccount', userController.downgradeAccount)
router.get('/users/:id/makeAdmin', userController.makeAdmin)
router.get('/users/:id/removeAdmin', userController.removeAdmin)

module.exports = router;