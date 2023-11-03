import mongoose from "mongoose";

import { Product } from "../models/product.js";
import { Order } from "../models/order.js";

export const getIndex = async (req, res, next) => {
  try {
    const products = await Product.find();
    res.render("shop/index", {
      prods: products,
      pageTitle: "Shop",
      path: "/",
    });
  } catch (error) {
    console.error(error);
  }
};

export const getProducts = async (req, res, next) => {
  try {
    const products = await Product.find();
    res.render("shop/product-list", {
      prods: products,
      pageTitle: "All Products",
      path: "/products",
    });
  } catch (error) {
    console.error(error);
  }
};

export const getProduct = async (req, res, next) => {
  const prodId = req.params.productId;
  try {
    const product = await Product.findOne({
      _id: new mongoose.Types.ObjectId(prodId),
    });

    if (product.id === prodId) {
      res.render("shop/product-detail", {
        product: product,
        pageTitle: product.title,
        path: "/products",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

export const getCart = async (req, res, next) => {
  try {
    const user = req.user;
    const userCart = user.cart.items;

    if (userCart.length > 0) {
      const cartProductId = userCart?.map((item) => item.product_id);
      const productsInCart = await Product.find({
        _id: { $in: cartProductId },
      });

      const cartsData = productsInCart?.map((product) => ({
        ...product._doc,
        quantity: userCart.find(
          (p) => p.product_id.toString() === product._id.toString()
        ).quantity,
      }));

      res.render("shop/cart", {
        path: "/cart",
        pageTitle: "Your Cart",
        products: cartsData,
      });
    } else {
      console.log({ userCart });
      res.render("shop/cart", {
        path: "/cart",
        pageTitle: "Your Cart",
        products: userCart,
      });
    }
  } catch (error) {
    console.error(error);
  }
};

export const postCart = async (req, res, next) => {
  try {
    const prodId = req.body.productId;
    const user = req.user;
    const userId = user._id;

    const userCart = user.cart.items;

    const existingItemIndex = userCart.findIndex(
      (product) => product.product_id?.toString() === prodId.toString()
    );
    const existingItem = userCart[existingItemIndex];
    console.log({ existingItem, existingItemIndex });
    const newQuantity = 1;
    let updatedItems;

    if (existingItem) {
      const updatedItem = {
        ...existingItem,
        quantity: existingItem.quantity + newQuantity,
      };

      updatedItems = {
        items: [...userCart],
      };
      updatedItems.items[existingItemIndex] = updatedItem;
    } else {
      const newProductToCart = {
        product_id: prodId,
        quantity: newQuantity,
      };

      updatedItems = {
        items: userCart.concat(newProductToCart),
      };
    }

    const carts = await user.addToCart(updatedItems);
    if (carts._id === userId) {
      res.redirect("/cart");
      return;
    }
  } catch (error) {
    console.error(error);
  }
};

export const postCartDeleteProduct = async (req, res, next) => {
  const prodId = req.body.productId;
  const user = req.user;
  const userCart = user.cart.items;

  try {
    const deletedItemsCart = userCart.filter(
      (item) => item.product_id.toString() !== prodId.toString()
    );

    user.cart.items = deletedItemsCart;

    await user.save();

    res.redirect("/cart");
  } catch (error) {
    console.error(error);
  }
};

export const postOrder = async (req, res, next) => {
  try {
    const user = req.user;
    const userId = user._id;
    const userCart = user?.cart.items;

    if (userCart.length > 0) {
      const cartProductId = userCart?.map((item) => item.product_id);
      const productsInCart = await Product.find({
        _id: { $in: cartProductId },
      });
      const cartsData = productsInCart?.map((product) => ({
        ...product._doc,
        quantity: userCart.find(
          (p) => p.product_id.toString() === product._id.toString()
        )?.quantity,
      }));

      const total = cartsData.reduce(
        (acc, curr) => acc + Number(curr?.price),
        0
      );

      const newOrder = {
        products: cartsData,
        user: {
          user_id: userId,
          name: user.name,
          email: user.email,
        },
        total,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const order = new Order(newOrder);

      const saveOrder = await order.save();

      if (saveOrder.user.user_id === userId) {
        user.cart.items = [];
        const saveCart = await user.save();

        if (saveCart?.id) {
          res.redirect("/orders");
        }
      }
    }
  } catch (error) {
    console.error(error);
  }
};

export const getOrders = async (req, res, next) => {
  try {
    const user = req.user;
    const userId = user._id;
    const userOrder = await Order.find({ "user.user_id": userId });
    console.log({ userOrder });

    if (userOrder.length === 0 || !userOrder) {
      throw new Error("Failed get user orders");
    }

    res.render("shop/orders", {
      path: "/orders",
      pageTitle: "Your Orders",
      orders: userOrder,
    });
  } catch (error) {
    console.error(error);
  }
};

// // export const getCheckout = (req, res, next) => {
// //   res.render("shop/checkout", {
// //     path: "/checkout",
// //     pageTitle: "Checkout",
// //   });
// // };
