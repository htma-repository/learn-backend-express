import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    cart: {
      items: [
        {
          product_id: {
            type: Schema.ObjectId,
            ref: "Product",
            required: true,
          },
          quantity: {
            type: Number,
            required: true,
          },
        },
      ],
    },
    created_at: {
      type: String,
      required: true,
    },
    updated_at: {
      type: String,
      required: true,
    },
  },
  {
    methods: {
      addToCart(productsToCarts) {
        this.cart = productsToCarts;
        return this.save();
      },
    },
  }
);

export const User = model("User", userSchema);
