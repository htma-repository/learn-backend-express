import { ObjectId } from "mongodb";

import { dbConnect } from "../utils/db.js";

export async function productsCollection() {
  const db = await dbConnect();
  const collection = db.collection("products");
  return collection;
}

class Product {
  constructor(
    title,
    price,
    description,
    image_url,
    created_at,
    updated_at,
    userId
  ) {
    this.title = title;
    this.price = price;
    this.description = description;
    this.image_url = image_url;
    this.created_at = created_at;
    this.updated_at = updated_at;
    this.user_id = userId;
  }

  async save() {
    const collection = await productsCollection();
    const result = await collection.insertOne(this);
    return result;
  }

  static async getAll() {
    const collection = await productsCollection();
    const result = await collection.find().toArray();
    return result;
  }

  static async getOne(prodId) {
    const collection = await productsCollection();
    const result = await collection.findOne({
      _id: new ObjectId(prodId),
    });
    return result;
  }

  static async updateProduct(prodId, updatedData) {
    const collection = await productsCollection();
    const result = await collection.updateOne(
      { _id: new ObjectId(prodId) },
      {
        $set: updatedData,
      }
    );
    return result;
  }

  static async deleteProduct(prodId) {
    const collection = await productsCollection();
    const result = await collection.deleteOne({
      _id: new ObjectId(prodId),
    });
    return result;
  }
}

export default Product;
