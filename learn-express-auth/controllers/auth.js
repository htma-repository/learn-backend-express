const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const User = require("../models/user");
const crypto = require("crypto");

exports.getLogin = (req, res, next) => {
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    isAuthenticated: false,
    error: false,
    oldInput: {
      email: "",
      password: "",
    },
  });
};

exports.getSignup = (req, res, next) => {
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    isAuthenticated: false,
    error: false,
    oldInput: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });
};

exports.postLogin = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  const errors = validationResult(req);

  const errorsResult = errors.formatWith((err) => err.msg).array();

  console.log({ errorsResult });

  if (!errors.isEmpty()) {
    return res.status(422).render("auth/login", {
      path: "/login",
      pageTitle: "Login",
      isAuthenticated: false,
      error: true,
      errorMessage: errorsResult,
      oldInput: {
        email,
        password,
      },
    });
  }

  try {
    const user = await User.findOne({ email });
    // const passwordCompare = await bcrypt.compare(password, user?.password);

    // console.log({ passwordCompare });

    // if (!user) {
    //   return res.render("auth/login", {
    //     path: "/login",
    //     pageTitle: "Login",
    //     isAuthenticated: false,
    //     error: true,
    //     errorMessage: "User does not exist with this email address!",
    //   });
    // }

    // if (!passwordCompare) {
    //   return res.render("auth/login", {
    //     path: "/login",
    //     pageTitle: "Login",
    //     isAuthenticated: false,
    //     error: true,
    //     errorMessage: "Incorrect password!",
    //   });
    // }

    // if (passwordCompare) {
    req.session.isLoggedIn = true;
    req.session.user = user;
    return req.session.save((err) => {
      console.log(err);
      res.redirect("/");
    });
    // }
  } catch (error) {
    console.error(error);
  }
};

exports.postSignup = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  const errors = validationResult(req);

  const errorsResult = errors.formatWith((err) => err.msg).array();

  console.log({ errorsResult });

  if (!errors.isEmpty()) {
    return res.status(422).render("auth/signup", {
      path: "/signup",
      pageTitle: "Signup",
      isAuthenticated: false,
      error: true,
      errorMessage: errorsResult,
      oldInput: {
        email,
        password,
        confirmPassword,
      },
    });
  }

  try {
    // if (!email.includes("@")) {
    //   return res.render("auth/signup", {
    //     path: "/signup",
    //     pageTitle: "Signup",
    //     isAuthenticated: false,
    //     error: true,
    //     errorMessage: "Invalid email address!",
    //   });
    // }

    // if (password.length < 6 || !password) {
    //   return res.render("auth/signup", {
    //     path: "/signup",
    //     pageTitle: "Signup",
    //     isAuthenticated: false,
    //     error: true,
    //     errorMessage: "Password must at least 6 characters long!",
    //   });
    // }

    // if (password !== confirmPassword) {
    //   return res.render("auth/signup", {
    //     path: "/signup",
    //     pageTitle: "Signup",
    //     isAuthenticated: false,
    //     error: true,
    //     errorMessage: "Passwords do not match!",
    //   });
    // }
    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new User({
      email: email,
      password: hashedPassword,
      cart: { items: [] },
    });
    const addNewUser = await newUser.save();

    if (addNewUser.id) {
      res.redirect("/login");
    }
  } catch (error) {
    console.error(error);
  }
};

exports.postLogout = (req, res, next) => {
  return req.session.destroy((err) => {
    console.log(err);
    res.redirect("/");
  });
};

exports.getForgotPassword = (req, res, next) => {
  res.render("auth/forgot-password", {
    path: "/forgot-password",
    pageTitle: "Forgot Password",
    isAuthenticated: false,
    error: false,
  });
};

exports.postForgotPassword = (req, res, next) => {
  const userEmail = req.body.email;
  console.log({ userEmail });
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      return res.render("auth/forgot-password", {
        path: "/forgot-password",
        pageTitle: "Forgot Password",
        isAuthenticated: false,
        error: true,
        errorMessage: "Something went wrong. Please try again!",
      });
    }

    const token = buffer.toString("hex");
    console.log({ token });

    User.findOne({ email: userEmail })
      .then((user) => {
        if (!user) {
          return res.render("auth/forgot-password", {
            path: "/forgot-password",
            pageTitle: "Forgot Password",
            isAuthenticated: false,
            error: true,
            errorMessage: "User does not exist with this email address!",
          });
        }

        const tokenExpiration1h = 3600000;

        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + tokenExpiration1h;

        return user.save();
      })
      .then(() => {
        console.log("sending email...");
        console.log(`http://127.0.0.1:3000/new-password/${token}`);
        // res.redirect("/");
        // return transporter.sendMail({
        //   to: userEmail,
        //   from: "t3nYR@example.com",
        //   subject: "Password Reset",
        //   html: `
        //   <p>You requested a password reset</p>
        //   <p>Click this <a href="http://localhost:3000/forgot-password/${token}">link</a> to set a new password.</p>
        //   `,
        // });
      })
      .catch((error) => {
        console.error(error);
      });
  });
};

exports.getNewPassword = async (req, res, next) => {
  const token = req.params.token;
  try {
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiration: { $gt: Date.now() },
    });

    if (!user) {
      return res.render("auth/new-password", {
        path: "/new-password",
        pageTitle: "New Password",
        isAuthenticated: false,
        error: true,
        errorMessage: "Token has expired!",
        passwordToken: token,
      });
    }

    res.render("auth/new-password", {
      path: "/new-password",
      pageTitle: "New Password",
      isAuthenticated: false,
      error: false,
      passwordToken: token,
      userId: user._id,
    });
  } catch (error) {
    console.error(error);
  }
};

exports.postNewPassword = async (req, res, next) => {
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  const userId = req.body.userId;
  const passwordToken = req.body.passwordToken;

  if (password !== confirmPassword) {
    return res.render("auth/new-password", {
      path: "/new-password",
      pageTitle: "New Password",
      isAuthenticated: false,
      error: true,
      errorMessage: "Passwords do not match!",
    });
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.findOne({
      resetToken: passwordToken,
      resetTokenExpiration: { $gt: Date.now() },
      _id: userId,
    });

    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpiration = undefined;

    const updatedUser = await user.save();

    console.log({ updatedUser, isModified: updatedUser.isModified() });

    if (updatedUser.isModified()) {
      res.redirect("/login");
    }
  } catch (error) {
    console.error(error);
  }
};
