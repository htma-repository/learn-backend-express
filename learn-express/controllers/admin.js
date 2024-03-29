import Product from "../models/product.js";

export const getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
  });
};

export const postAddProduct = async (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;

  // With Mysql2
  const product = new Product(null, title, imageUrl, description, price);
  try {
    await product.save();
    res.setHeader("Content-Type", "text/html");
    res.redirect("/");
  } catch (error) {
    console.log(error);
  }
};

export const getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect("/");
  }
  const prodId = req.params.productId;

  Product.findById(prodId).then(([rows, fields]) => {
    const product = {
      ...rows[0],
      imageUrl: rows[0].image_url,
    };
    if (!product) {
      return res.redirect("/");
    }
    res.render("admin/edit-product", {
      pageTitle: "Edit Product",
      path: "/admin/edit-product",
      editing: editMode,
      product: product,
    });
  });
};

export const postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;
  const updatedProduct = new Product(
    prodId,
    updatedTitle,
    updatedImageUrl,
    updatedDesc,
    updatedPrice
  );
  console.log({ updatedProduct });
  updatedProduct.updateProduct();
  res.redirect("/admin/products");
};

export const getProducts = (req, res, next) => {
  Product.fetchAll().then(([rows, fields]) => {
    const products = rows.map((row) => ({
      ...row,
      imageUrl: row.image_url,
    }));
    res.render("admin/products", {
      prods: products,
      pageTitle: "Admin Products",
      path: "/admin/products",
    });
  });
};

export const postDeleteProduct = async (req, res, next) => {
  const prodId = req.body.productId;
  try {
    await Product.deleteById(prodId);
    res.redirect("/admin/products");
  } catch (error) {
    console.log(error);
  }
};
