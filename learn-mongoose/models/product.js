import { Schema, model } from "mongoose";

export const product = {
  title: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image_url: {
    type: String,
    required: true,
  },
  user_id: {
    type: Schema.ObjectId,
    ref: "User",
    required: true,
  },
};

const productSchema = new Schema({
  ...product,
  created_at: {
    type: String,
    required: true,
  },
  updated_at: {
    type: String,
    required: true,
  },
});

export const Product = model("Product", productSchema);
