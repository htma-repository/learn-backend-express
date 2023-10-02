import Product from "../models/product.js";
// import Cart from "../models/cart.js";

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

export const getCart = (req, res, next) => {
  // Cart.getCart().then(([rows, fields]) => {
  //   console.log({ rows });
  //   // res.render("shop/cart", {
  //   //   path: "/cart",
  //   //   pageTitle: "Your Cart",
  //   //   products: cartProducts,
  //   // });
  // });
  // Cart.getCart((cart) => {
  //   Product.fetchAll((products) => {
  //     const cartProducts = [];
  //     for (const product of products) {
  //       const cartProductData = cart.products.find(
  //         (prod) => prod.id === product.id
  //       );
  //       if (cartProductData) {
  //         cartProducts.push({ productData: product, qty: cartProductData.qty });
  //       }
  //     }
  //     res.render("shop/cart", {
  //       path: "/cart",
  //       pageTitle: "Your Cart",
  //       products: cartProducts,
  //     });
  //   });
  // });
};

export const postCart = (req, res, next) => {
  const prodId = req.body.productId;
  // Product.findById(prodId, (product) => {
  //   Cart.addProduct(prodId, product.price);
  // });
  // res.redirect("/cart");
};

export const postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  // Product.findById(prodId, (product) => {
  //   Cart.deleteProduct(prodId, product.price);
  //   res.redirect("/cart");
  // });
};

export const getOrders = (req, res, next) => {
  res.render("shop/orders", {
    path: "/orders",
    pageTitle: "Your Orders",
  });
};

export const getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    path: "/checkout",
    pageTitle: "Checkout",
  });
};
