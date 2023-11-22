const express = require("express");

const validator = require("../util/validator");

const authController = require("../controllers/auth");

const router = express.Router();

router.get("/login", authController.getLogin);

router.get("/signup", authController.getSignup);

router.post(
  "/login",
  validator.emailSignInValidation(),
  validator.passwordSignInValidation(),
  authController.postLogin
);

router.post(
  "/signup",
  validator.emailSignUpValidation(),
  validator.passwordSignUpValidation(),
  validator.confirmPasswordValidation(),
  authController.postSignup
);

router.post("/logout", authController.postLogout);

router.get("/forgot-password", authController.getForgotPassword);

router.post("/forgot-password", authController.postForgotPassword);

router.get("/new-password/:token", authController.getNewPassword);

router.post("/new-password", authController.postNewPassword);

module.exports = router;
