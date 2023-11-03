import mongoose from "mongoose";
import { Product } from "../models/product.js";

export const getProducts = async (req, res, next) => {
  try {
    const products = await Product.find();
    // .select("title price")
    // .populate("user_id", "name");

    res.render("admin/products", {
      prods: products,
      pageTitle: "Products",
      path: "/admin/products",
    });
  } catch (error) {
    console.error(error);
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
  const userId = req.user;
  try {
    const newProduct = new Product({
      title,
      price,
      description,
      image_url: imageUrl,
      user_id: userId,
      created_at: createdAt,
      updated_at: updatedAt,
    });
    const result = await newProduct.save();
    console.log({ result });
    if (result?.id) {
      res.redirect("/");
    }
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
};

export const getEditProduct = async (req, res, next) => {
  const prodId = req.params.productId;
  const editMode = req.query.edit;

  if (!editMode) {
    return res.redirect("/");
  }

  try {
    const product = await Product.findById(prodId);
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
  }
};

export const postEditProduct = async (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;

  try {
    const update = await Product.findOneAndUpdate(
      {
        _id: new mongoose.Types.ObjectId(prodId),
      },
      {
        title: updatedTitle,
        price: updatedPrice,
        image_url: updatedImageUrl,
        description: updatedDesc,
        updated_at: new Date().toISOString(),
      }
    );
    if (update.id === prodId) {
      res.redirect("/admin/products");
    }
  } catch (error) {
    console.error(error);
  }
};

export const postDeleteProduct = async (req, res, next) => {
  const prodId = req.body.productId;
  try {
    const deletedResult = await Product.findOneAndDelete({
      _id: new mongoose.Types.ObjectId(prodId),
    });
    console.log({ deletedResult });
    if (deletedResult.id === prodId) {
      res.redirect("/admin/products");
    }
  } catch (error) {
    console.error(error);
  }
};
