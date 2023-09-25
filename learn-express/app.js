import path from "path";
import express from "express";

import adminRoutes from "./routes/admin.js";
import shopRoutes from "./routes/shop.js";
import { get404 } from "./controllers/error.js";
import dirname from "./utils/dirname.js";
import { sequelize } from "./utils/db.js";

const app = express();

const hostname = "127.0.0.1";
const port = 3000;

app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(dirname, "public")));

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(get404);

sequelize
  .sync()
  .then((res) => {
    console.log(res);
    app.listen(port, () => {
      console.log(`Server running at http://${hostname}:${port}/`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
