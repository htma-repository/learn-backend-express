import path from "path";
import express from "express";
import dotenv from "dotenv/config.js";

import adminRoutes from "./routes/admin.js";
import shopRoutes from "./routes/shop.js";
import { get404 } from "./controllers/error.js";
import dirname from "./utils/dirname.js";
import { mongoConnect } from "./utils/db.js";
import User from "./models/user.js";

const env = dotenv;

const app = express();

const hostname = "127.0.0.1";
const port = 3000;

app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(dirname, "public")));

app.use(async (req, res, next) => {
  try {
    const user = await User.getOneUser("653043289562287cc6289bec");
    req.user = user;
    next();
  } catch (error) {
    console.error(error);
  }
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(get404);

mongoConnect()
  .then((client) => {
    app.listen(port, () => {
      console.log(`Server running at http://${hostname}:${port}/`);
    });
  })
  .catch((error) => {
    console.error(error);
  });
