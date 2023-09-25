import Product from "../models/products-sequelize.js";
// import Cart from "../models/cart.js";

export const getIndex = async (req, res, next) => {
  try {
    const products = await Product.findAll();
    console.log({ products: JSON.stringify(products) });
  } catch (error) {
    console.log(error);
  }
  // With Mysql try catch
  // try {
  //   const [rows] = await Product.fetchAll();
  //   const products = rows.map((row) => ({ ...row, imageUrl: row.image_url }));
  //   res.render("shop/index", {
  //     prods: products,
  //     pageTitle: "Shop",
  //     path: "/",
  //   });
  // } catch (error) {
  //   console.log(error);
  // }
  // With Mysql then catch
  // Product.fetchAll()
  //   .then(([rows, fields]) => {
  //     const products = rows.map((row) => ({ ...row, imageUrl: row.image_url }));
  //     res.render("shop/index", {
  //       prods: products,
  //       pageTitle: "Shop",
  //       path: "/",
  //     });
  //   })
  //   .catch((error) => {
  //     console.log(error);
  //   });
};

export const getProducts = async (req, res, next) => {
  // try {
  //   const [rows] = await Product.fetchAll();
  //   const products = rows.map((row) => ({ ...row, imageUrl: row.image_url }));
  //   res.render("shop/product-list", {
  //     prods: products,
  //     pageTitle: "All Products",
  //     path: "/products",
  //   });
  // } catch (error) {
  //   console.log(error);
  // }
  // Product.fetchAll()
  //   .then(([rows, fields]) => {
  //     const products = rows.map((row) => ({
  //       ...row,
  //       imageUrl: row.image_url,
  //     }));
  //     res.render("shop/product-list", {
  //       prods: products,
  //       pageTitle: "All Products",
  //       path: "/products",
  //     });
  //   })
  //   .catch((error) => {
  //     console.log(error);
  //   });
};

export const getProduct = async (req, res, next) => {
  const prodId = req.params.productId;
  // try {
  //   const [rows] = await Product.findById(prodId);
  //   const product = {
  //     ...rows[0],
  //     imageUrl: rows[0]?.image_url,
  //   };
  //   res.render("shop/product-detail", {
  //     product: product,
  //     pageTitle: product.title,
  //     path: "/products",
  //   });
  // } catch (error) {
  //   console.log(error);
  // }

  // Product.findById(prodId).then(([rows, fields]) => {
  //   console.log({ rows });
  //   const product = {
  //     ...rows[0],
  //     imageUrl: rows[0]?.image_url,
  //   };
  //   res.render("shop/product-detail", {
  //     product: product,
  //     pageTitle: product.title,
  //     path: "/products",
  //   });
  // });
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
