import Product from "../models/product.js";

function getAllProducts() {
  return Product.findAll();
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
  }
};

export const getProducts = async (req, res, next) => {
  try {
    const products = await getAllProducts();
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
    const product = await Product.findOne({ where: { id: prodId } });
    res.render("shop/product-detail", {
      product: product,
      pageTitle: product.title,
      path: "/products",
    });
  } catch (error) {
    console.log(error);
  }
};

export const getCart = async (req, res, next) => {
  try {
    const cart = await req.user.getCart();
    const products = await cart.getProducts();
    console.log({ products });
    res.render("shop/cart", {
      path: "/cart",
      pageTitle: "Your Cart",
      products: products,
    });
  } catch (error) {
    console.error(error);
  }
};

export const postCart = async (req, res, next) => {
  try {
    const prodId = req.body.productId;
    const cart = await req.user.getCart();
    const products = await cart.getProducts({ where: { id: prodId } });
    let product;
    if (products.length > 0) {
      product = products[0];
    }
    let defaultQuantity = 1;
    if (product) {
      const oldQuantity = product.cart_item.quantity;
      await cart.addProduct(product, {
        through: { quantity: oldQuantity + defaultQuantity },
      });
      res.redirect("/cart");
    } else {
      const product = await Product.findOne({ where: { id: prodId } });
      await cart.addProduct(product, {
        through: { quantity: defaultQuantity },
      });
      res.redirect("/cart");
    }
  } catch (error) {
    console.error(error);
  }
};

export const postCartDeleteProduct = async (req, res, next) => {
  const cart = await req.user.getCart();
  const prodId = req.body.productId;
  try {
    await cart.removeProduct(prodId);
    res.redirect("/cart");
  } catch (error) {
    console.error(error);
  }
};

export const postOrder = async (req, res, next) => {
  try {
    const cart = await req.user.getCart();
    const products = await cart.getProducts();

    const order = await req.user.createOrder();
    await order.addProducts(
      products.map((product) => {
        product.order_item = { quantity: product.cart_item.quantity };
        return product;
      })
    );
    res.redirect("/orders");
  } catch (error) {
    console.error(error);
  }
};

export const getOrders = async (req, res, next) => {
  try {
    const orders = await req.user.getOrders({ include: ["products"] });
    if (orders) {
      res.render("shop/orders", {
        path: "/orders",
        pageTitle: "Your Orders",
        orders: orders,
      });
    }
  } catch (error) {
    console.error(error);
  }
};

export const getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    path: "/checkout",
    pageTitle: "Checkout",
  });
};
