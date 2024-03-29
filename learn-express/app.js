import path from "path";
import express from "express";

import adminRoutes from "./routes/admin.js";
import shopRoutes from "./routes/shop.js";
import { get404 } from "./controllers/error.js";
import dirname from "./utils/dirname.js";

const app = express();

const hostname = "127.0.0.1";
const port = 3000;

app.set("view engine", "ejs");
app.set("views", "views");

app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

app.use(express.urlencoded({ extended: true }));
//app.use(express.json())
app.use(express.static(path.join(dirname, "public")));

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(get404);

app.listen(port, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
