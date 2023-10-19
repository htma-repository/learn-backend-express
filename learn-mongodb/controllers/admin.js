import Product from "../models/product.js";

import { mongoConnect } from "../utils/db.js";

const client = await mongoConnect();

export const getProducts = async (req, res, next) => {
  try {
    const products = await Product.getAll();
    res.render("admin/products", {
      prods: products,
      pageTitle: "Products",
      path: "/admin/products",
    });
  } catch (error) {
    console.error(error);
  } finally {
    await client.close();
  }
};

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
  const createdAt = new Date().toISOString();
  const updatedAt = new Date().toISOString();
  const userId = req.user._id;
  try {
    const newProduct = new Product(
      title,
      price,
      description,
      imageUrl,
      createdAt,
      updatedAt,
      userId
    );
    await newProduct.save();
    res.redirect("/");
  } catch (error) {
    console.error(error);
    throw new Error(error);
  } finally {
    await client.close();
  }
};

export const getEditProduct = async (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect("/");
  }
  const prodId = req.params.productId;

  try {
    const product = await Product.getOne(prodId);
    if (!product) {
      return res.redirect("/");
    }
    res.render("admin/edit-product", {
      pageTitle: "Edit Product",
      path: "/admin/edit-product",
      editing: editMode,
      product: product,
    });
  } catch (error) {
    console.error(error);
  } finally {
    await client.close();
  }
};

export const postEditProduct = async (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;

  try {
    const update = await Product.updateProduct(prodId, {
      title: updatedTitle,
      price: updatedPrice,
      image_url: updatedImageUrl,
      description: updatedDesc,
      updated_at: new Date().toISOString(),
    });
    if (update.modifiedCount === 1) {
      res.redirect("/admin/products");
    }
  } catch (error) {
    console.error(error);
  } finally {
    await client.close();
  }
};

export const postDeleteProduct = async (req, res, next) => {
  const prodId = req.body.productId;
  try {
    const deletedResult = await Product.deleteProduct(prodId);
    if (deletedResult.deletedCount === 1) {
      res.redirect("/admin/products");
    }
  } catch (error) {
    console.error(error);
  } finally {
    await client.close();
  }
};
