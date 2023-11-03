const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);

const errorController = require("./controllers/error");
const User = require("./models/user");

const app = express();
const host = "127.0.0.1";
const port = "3000";
const MONGODB_URL =
  "mongodb+srv://hutamatr:bfqXZkTiPfVJH6mg@cluster0.pfnfwdg.mongodb.net/?retryWrites=true&w=majority";
const dbName = "shop";

const store = new MongoDBStore({
  uri: MONGODB_URL,
  collection: "sessions",
  expires: 1000 * 60 * 60,
  databaseName: dbName,
});

// Catch errors
store.on("error", function (error) {
  console.log(error);
});

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

app.use((req, res, next) => {
  User.findById("654363935b8a67a85f92bd9d")
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

mongoose
  .connect(MONGODB_URL, { dbName: dbName })
  .then((result) => {
    User.findOne().then((user) => {
      if (!user) {
        const user = new User({
          name: "hutamatr",
          email: "hutamatr@test.com",
          cart: {
            items: [],
          },
        });
        user.save();
      }
    });
    app.listen(port, () => {
      console.log(`Server started at http://${host}:${port}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
