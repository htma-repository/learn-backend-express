const User = require("../models/user");

exports.getLogin = (req, res, next) => {
  // const isLoggedIn = Boolean(req.get("Cookie")?.split("=")[1]);
  const isLoggedIn = req.session.isLoggedIn;
  console.log({ isLoggedIn });
  if (isLoggedIn) {
    res.render("auth/login", {
      path: "/login",
      pageTitle: "Login",
      isAuthenticated: isLoggedIn,
    });
  } else {
    res.render("auth/login", {
      path: "/login",
      pageTitle: "Login",
      isAuthenticated: false,
    });
  }
};

exports.postLogin = (req, res, next) => {
  User.findById("654363935b8a67a85f92bd9d")
    .then((user) => {
      req.session.user = user;
      req.session.isLoggedIn = true;
      res.redirect("/");
    })
    .catch((error) => {
      console.error(error);
    });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy();
  res.redirect("/");
};
