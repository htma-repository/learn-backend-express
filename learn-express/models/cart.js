// import db from "../utils/db.js";
// // import fs from "fs";
// // import path from "path";

// // import dirname from "../utils/dirname.js";

// // const p = path.join(dirname, "data", "cart.json");

// export default class Cart {
//   static addProduct(id, productPrice) {
//     // With Mysql2
//     // db.execute("SELECT * FROM cart").then(() => {});
//     // With local json
//     // // Fetch the previous cart
//     // fs.readFile(p, (err, fileContent) => {
//     //   let cart = { products: [], totalPrice: 0 };
//     //   if (!err) {
//     //     cart = JSON.parse(fileContent);
//     //   }
//     //   // Analyze the cart => Find existing product
//     //   const existingProductIndex = cart.products.findIndex(
//     //     (prod) => prod.id === id
//     //   );
//     //   const existingProduct = cart.products[existingProductIndex];
//     //   let updatedProduct;
//     //   // Add new product/ increase quantity
//     //   if (existingProduct) {
//     //     updatedProduct = { ...existingProduct };
//     //     updatedProduct.qty = updatedProduct.qty + 1;
//     //     cart.products = [...cart.products];
//     //     cart.products[existingProductIndex] = updatedProduct;
//     //   } else {
//     //     updatedProduct = { id: id, qty: 1 };
//     //     cart.products = [...cart.products, updatedProduct];
//     //   }
//     //   cart.totalPrice = cart.totalPrice + +productPrice;
//     //   fs.writeFile(p, JSON.stringify(cart), (err) => {
//     //     console.log(err);
//     //   });
//     // });
//   }

//   static deleteProduct(id, productPrice) {
//     // With local json
//     // fs.readFile(p, (err, fileContent) => {
//     //   if (err) {
//     //     return;
//     //   }
//     //   const updatedCart = { ...JSON.parse(fileContent) };
//     //   const product = updatedCart.products.find((prod) => prod.id === id);
//     //   if (!product) {
//     //     return;
//     //   }
//     //   const productQty = product.qty;
//     //   updatedCart.products = updatedCart.products.filter(
//     //     (prod) => prod.id !== id
//     //   );
//     //   updatedCart.totalPrice =
//     //     updatedCart.totalPrice - productPrice * productQty;
//     //   fs.writeFile(p, JSON.stringify(updatedCart), (err) => {
//     //     console.log(err);
//     //   });
//     // });
//   }

//   static getCart() {
//     // With Mysql2
//     // return db.execute("SELECT * FROM cart");
//     // With local json
//     // fs.readFile(p, (err, fileContent) => {
//     //   const cart = JSON.parse(fileContent);
//     //   if (err) {
//     //     cb(null);
//     //   } else {
//     //     cb(cart);
//     //   }
//     // });
//   }
// }
