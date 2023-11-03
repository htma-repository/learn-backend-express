import { Schema, model } from "mongoose";

import { product } from "./product.js";

const orderSchema = new Schema(
  {
    products: [
      {
        quantity: {
          type: Number,
          required: true,
        },
        ...product,
      },
    ],
    user: {
      name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      user_id: {
        type: Schema.ObjectId,
        required: true,
      },
    },
    total: {
      type: Number,
      required: true,
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
      getOrderItems() {
        return this;
      },
    },
  }
);

export const Order = model("Order", orderSchema);
