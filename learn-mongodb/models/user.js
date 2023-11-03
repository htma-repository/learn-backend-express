import { ObjectId } from "mongodb";

import { dbConnect } from "../utils/db.js";

export async function usersCollection() {
  const db = await dbConnect();
  const collection = db.collection("users");
  return collection;
}

async function ordersCollection() {
  const db = await dbConnect();
  const orderCollection = db.collection("orders");
  return orderCollection;
}

class User {
  constructor(name, email, cart) {
    this.name = name;
    this.email = email;
    this.cart = cart;
  }

  async addNewUser() {
    const collection = await usersCollection();
    const result = await collection.insertOne(this);
    return result;
  }

  static async getAllUsers() {
    const collection = await usersCollection();
    const result = await collection.find().toArray();
    return result;
  }

  static async getOneUser(userId) {
    const collection = await usersCollection();
    const result = await collection.findOne({
      _id: new ObjectId(userId),
    });
    return result;
  }

  static async updateUser(userId, updatedUser) {
    const collection = await usersCollection();
    const result = await collection.updateOne(
      { _id: new ObjectId(userId) },
      { $set: updatedUser }
    );
    return result;
  }

  static async deleteUser(userId) {
    const collection = await usersCollection();
    const result = await collection.deleteOne({ _id: new ObjectId(userId) });
    return result;
  }

  static async AddToCart(userId, productsToCarts) {
    const collection = await usersCollection();
    const result = await collection.updateOne(
      { _id: new ObjectId(userId) },
      {
        $set: { cart: productsToCarts },
      }
    );
    return result;
  }

  static async getCart(userId) {
    const result = await this.getOneUser(userId);
    const userCart = result?.cart?.items;
    return userCart;
  }

  static async addToOrder(ordersData) {
    const orderCollection = await ordersCollection();

    const result = await orderCollection.insertOne(ordersData);
    return result;
  }

  static async getOrdersItems(userId) {
    const orderCollection = await ordersCollection();
    const result = await orderCollection.findOne({
      "user._id": new ObjectId(userId),
    });

    return result;
  }
}

export default User;
