import Product from "../models/product.js";

export const getProducts = async (req, res, next) => {
  try {
    // const products = await Product.findAll();
    const products = await req.user.getProducts();
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
  try {
    await req.user.createProduct({
      title,
      image_url: imageUrl,
      price,
      description,
    });
    res.setHeader("Content-Type", "text/html");
    res.redirect("/");
  } catch (error) {
    console.error(error);
  }
};

export const getEditProduct = async (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect("/");
  }
  const prodId = req.params.productId;

  try {
    // const product = await Product.findOne({ where: { id: prodId } });
    const getProduct = await req.user.getProducts({ where: { id: prodId } });
    const product = getProduct[0];
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
    const updatedProduct = await Product.update(
      {
        title: updatedTitle,
        price: updatedPrice,
        image_url: updatedImageUrl,
        description: updatedDesc,
      },
      { where: { id: prodId } }
    );
    if (updatedProduct[0] >= 1) {
      res.redirect("/admin/products");
    }
  } catch (error) {
    console.error(error);
  }
};

export const postDeleteProduct = async (req, res, next) => {
  const prodId = req.body.productId;

  try {
    await Product.destroy({ where: { id: prodId } });
    res.redirect("/admin/products");
  } catch (error) {
    console.error(error);
  }
};
