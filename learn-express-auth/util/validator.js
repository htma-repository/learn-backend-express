const bcrypt = require("bcrypt");
const { body } = require("express-validator");
const User = require("../models/user");

exports.emailSignUpValidation = () => {
  return body("email")
    .isEmail()
    .withMessage("Please input valid email address!")
    .custom(async (value, { req }) => {
      const user = await User.findOne({ email: value });
      if (user) {
        throw new Error("E-mail already in use");
      }
      return true;
    })
    .escape();
};

exports.emailSignInValidation = () => {
  return body("email", "Please input valid email address!")
    .isEmail()
    .custom(async (value) => {
      const user = await User.findOne({ email: value });

      if (!user) {
        throw new Error("User does not exist with this email address!");
      }

      return true;
    })
    .escape();
};

exports.passwordSignInValidation = () => {
  return body("password")
    .notEmpty()
    .withMessage("Password should not empty!")
    .isLength({ min: 6 })
    .withMessage("Password at least 6 characters length!")
    .custom(async (value, { req }) => {
      const user = await User.findOne({ email: req.body.email });
      console.log({ user });
      const passwordCompare = await bcrypt.compare(value, user?.password);

      if (!passwordCompare) {
        throw new Error("Incorrect password!");
      }

      return true;
    })
    .escape();
};

exports.passwordSignUpValidation = () => {
  return body("password")
    .notEmpty()
    .withMessage("Password should not empty!")
    .isLength({ min: 6 })
    .withMessage("Password at least 6 characters length!")
    .escape();
};

exports.confirmPasswordValidation = () => {
  return body("confirmPassword")
    .notEmpty()
    .withMessage("Confirm Password should not empty!")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Password not match!");
      }
      return true;
    })
    .escape();
};
