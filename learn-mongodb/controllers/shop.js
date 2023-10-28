import { ObjectId } from "mongodb";
import Product, { productsCollection } from "../models/product.js";
import User, { usersCollection } from "../models/user.js";

import { mongoConnect } from "../utils/db.js";

const client = await mongoConnect();

function getAllProducts() {
  return Product.getAll();
}

export const getIndex = async (req, res, next) => {
  try {
    const products = await getAllProducts();
    res.render("shop/index", {
      prods: products,
      pageTitle: "Shop",
      path: "/",
    });
  } catch (error) {
    console.error(error);
  } finally {
    await client.close();
  }
};

export const getProducts = async (req, res, next) => {
  try {
    const products = await getAllProducts();
    console.log({ products });
    res.render("shop/product-list", {
      prods: products,
      pageTitle: "All Products",
      path: "/products",
    });
  } catch (error) {
    console.error(error);
  } finally {
    await client.close();
  }
};

export const getProduct = async (req, res, next) => {
  try {
    const prodId = req.params.productId;
    console.log({ prodIdController: prodId });
    const product = await Product.getOne(prodId);
    res.render("shop/product-detail", {
      product: product,
      pageTitle: product.title,
      path: "/products",
    });
  } catch (error) {
    console.log(error);
  } finally {
    await client.close();
  }
};

export const getCart = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const prodCollection = await productsCollection();
    const userCart = await User.getCart(userId);

    if (userCart.length > 0) {
      const cartProductId = userCart?.map((item) => item.product_id);
      const productsInCart = await prodCollection
        .find({
          _id: { $in: cartProductId },
        })
        .toArray();
      const cartsData = productsInCart?.map((product) => ({
        ...product,
        quantity: userCart.find(
          (p) => p.product_id.toString() === product._id.toString()
        ).quantity,
      }));

      console.log({ cartsData });

      res.render("shop/cart", {
        path: "/cart",
        pageTitle: "Your Cart",
        products: cartsData,
      });
    } else {
      res.render("shop/cart", {
        path: "/cart",
        pageTitle: "Your Cart",
        products: userCart,
      });
    }
  } catch (error) {
    console.error(error);
  } finally {
    await client.close();
  }
};

export const postCart = async (req, res, next) => {
  try {
    const prodId = req.body.productId;
    const userId = req.user._id;
    const userCart = await User.getCart(userId);
    const existingItemIndex = userCart?.findIndex(
      (product) => product.product_id?.toString() === prodId.toString()
    );
    const existingItem = userCart[existingItemIndex];
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
        product_id: new ObjectId(prodId),
        quantity: newQuantity,
      };

      updatedItems = {
        items: userCart.concat(newProductToCart),
      };
    }

    const carts = await User.AddToCart(userId, updatedItems);
    if (carts.modifiedCount === 1) {
      res.redirect("/cart");
      return;
    }
  } catch (error) {
    console.error(error);
  } finally {
    await client.close();
  }
};

export const postCartDeleteProduct = async (req, res, next) => {
  const prodId = req.body.productId;
  const userId = req.user._id;
  const userCart = await User.getCart(userId);
  const userCollection = await usersCollection();
  try {
    const deletedItemsCart = userCart.filter(
      (item) => item.product_id.toString() !== prodId.toString()
    );

    const result = await userCollection.updateOne(
      { _id: new ObjectId(userId) },
      { $set: { cart: { items: deletedItemsCart } } }
    );

    if (result.modifiedCount === 1) {
      res.redirect("/cart");
    }
  } catch (error) {
    console.error(error);
  } finally {
    await client.close();
  }
};

export const postOrder = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const user = await User.getOneUser(userId);
    const userCart = user?.cart?.items;

    const prodCollection = await productsCollection();
    const userCollection = await usersCollection();

    if (userCart.length > 0) {
      const cartProductId = userCart?.map((item) => item.product_id);
      const productsInCart = await prodCollection
        .find({
          _id: { $in: cartProductId },
        })
        .toArray();
      const cartsData = productsInCart?.map((product) => ({
        ...product,
        quantity: userCart.find(
          (p) => p.product_id.toString() === product._id.toString()
        )?.quantity,
      }));

      const total = cartsData.reduce(
        (acc, curr) => acc + Number(curr?.price),
        0
      );

      const order = {
        items: cartsData,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
        },
        total,
        order_at: new Date().toISOString(),
      };

      const addOrder = await User.addToOrder(order);

      if (addOrder.insertedId) {
        const removeUserCart = await userCollection.updateOne(
          { _id: new ObjectId(userId) },
          { $set: { cart: { items: [] } } }
        );

        if (removeUserCart.modifiedCount === 1) {
          res.redirect("/orders");
        }
      }
    }
  } catch (error) {
    console.error(error);
  } finally {
    await client.close();
  }
  // try {
  //   const cart = await req.user.getCart();
  //   const products = await cart.getProducts();
  //   const order = await req.user.createOrder();
  //   await order.addProducts(
  //     products.map((product) => {
  //       product.order_item = { quantity: product.cart_item.quantity };
  //       return product;
  //     })
  //   );
  //   res.redirect("/orders");
  // } catch (error) {
  //   console.error(error);
  // }
};

// export const getOrders = async (req, res, next) => {
//   try {
//     const orders = await req.user.getOrders({ include: ["products"] });
//     if (orders) {
//       res.render("shop/orders", {
//         path: "/orders",
//         pageTitle: "Your Orders",
//         orders: orders,
//       });
//     }
//   } catch (error) {
//     console.error(error);
//   }
// };

// export const getCheckout = (req, res, next) => {
//   res.render("shop/checkout", {
//     path: "/checkout",
//     pageTitle: "Checkout",
//   });
// };
