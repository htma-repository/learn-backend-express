import path from "path";
import express from "express";

import adminRoutes from "./routes/admin.js";
import shopRoutes from "./routes/shop.js";
import { get404 } from "./controllers/error.js";
import dirname from "./utils/dirname.js";
import { sequelize } from "./utils/db.js";
import Product from "./models/product.js";
import User from "./models/user.js";
import Cart from "./models/cart.js";
import CartItem from "./models/cart-item.js";
import Order from "./models/order.js";
import OrderItem from "./models/order-item.js";

const app = express();

const hostname = "127.0.0.1";
const port = 3000;

app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(dirname, "public")));

app.use(async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { id: 1 } });
    req.user = user;
    next();
  } catch (error) {
    console.error(error);
  }
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(get404);

Product.belongsTo(User, {
  constraints: true,
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, { through: OrderItem });
Product.belongsToMany(Order, { through: OrderItem });

sequelize
  .sync()
  .then(() => {
    return User.findOne({ where: { id: 1 } });
  })
  .then((user) => {
    if (!user) {
      return User.create({
        username: "tama",
        email: "tama@gmail.com",
      });
    }
    return user;
  })
  .then(async (user) => {
    const cart = await user.getCart();
    console.log({ cart });
    if (!cart) {
      return user.createCart();
    }
    return cart;
  })
  .then((cart) => {
    app.listen(port, () => {
      console.log(`Server running at http://${hostname}:${port}/`);
    });
  })
  .catch((error) => {
    console.error(error);
  });
