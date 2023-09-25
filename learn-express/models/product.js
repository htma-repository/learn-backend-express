// import db from "../utils/db.js";

// // import Cart from "./cart.js";

// // With local json
// // const p = path.join(dirname, "data", "products.json");
// // const getProductsFromFile = (cb) => {
// //   fs.readFile(p, (err, fileContent) => {
// //     if (err) {
// //       cb([]);
// //     } else {
// //       cb(JSON.parse(fileContent));
// //     }
// //   });
// // };

// export default class Product {
//   constructor(id, title, imageUrl, description, price) {
//     this.id = id;
//     this.title = title;
//     this.imageUrl = imageUrl;
//     this.description = description;
//     this.price = price;
//   }

//   save() {
//     // With Mysql2
//     // return db.execute(
//     //   `INSERT INTO products(title, price, description, image_url) VALUES (?, ?, ?, ?)`,
//     //   [this.title, this.price, this.description, this.imageUrl]
//     // );
//     // With local json
//     // Save Products to File (product.json)
//     // getProductsFromFile((products) => {
//     //   console.log("products", products);
//     //   const existingProductIndex = products.findIndex(
//     //     (prod) => prod.id === this.id
//     //   );
//     //   if (existingProductIndex && existingProductIndex !== -1) {
//     //     console.log("existingProductIndex", existingProductIndex);
//     //     const updatedProducts = [...products];
//     //     updatedProducts[existingProductIndex] = this;
//     //     fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
//     //       console.log(err);
//     //     });
//     //   } else {
//     //     this.id = Date.now().toString();
//     //     console.log("this", this);
//     //     products.push(this);
//     //     fs.writeFile(p, JSON.stringify(products), (err) => {
//     //       console.log(err);
//     //     });
//     //   }
//     // });
//   }

//   updateProduct() {
//     // With Mysql2
//     // return db.execute(
//     //   "UPDATE products SET title = ?, image_url = ?, description = ?, price = ? WHERE id = ?",
//     //   [this.title, this.imageUrl, this.description, this.price, this.id]
//     // );
//   }

//   static deleteById(id) {
//     // With Mysql2
//     // return db.execute(`DELETE FROM products WHERE id = ${id}`);
//     // With local json
//     // Delete Product from File (product.json) by Id
//     // getProductsFromFile((products) => {
//     //   const product = products.find((prod) => prod.id === id);
//     //   const updatedProducts = products.filter((prod) => prod.id !== id);
//     //   fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
//     //     if (!err) {
//     //       Cart.deleteProduct(id, product.price);
//     //     }
//     //   });
//     // });
//   }

//   static fetchAll() {
//     // With Mysql2
//     // return db.execute("SELECT * FROM products");
//     // With local json
//     // Read Products from File (product.json)
//     // getProductsFromFile(cb);
//   }

//   static findById(id) {
//     // With Mysql2
//     // return db.execute("SELECT * FROM products WHERE id = ? ", [id]);
//     // With local json
//     // Read 1 Product from File (product.json) by Id
//     // getProductsFromFile((products) => {
//     //   const product = products.find((p) => p.id === id);
//     //   cb(product);
//     // });
//   }
// }
