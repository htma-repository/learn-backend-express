import { ObjectId } from "mongodb";

import { dbConnect } from "../utils/db.js";

async function userConnect() {
  const db = await dbConnect();
  const collection = db.collection("users");
  return collection;
}

class User {
  constructor(name, email) {
    this.name = name;
    this.email = email;
  }

  async addNewUser() {
    const collection = await userConnect();
    const result = await collection.insertOne(this);
    return result;
  }

  static async getAllUsers() {
    const collection = await userConnect();
    const result = await collection.find().toArray();
    return result;
  }

  static async getOneUser(userId) {
    const collection = await userConnect();
    const result = await collection.findOne({
      _id: new ObjectId(userId),
    });
    return result;
  }

  static async updateUser(userId, updatedUser) {
    const collection = await userConnect();
    const result = await collection.updateOne(userId, { $set: updatedUser });
    return result;
  }

  static async deleteUser(userId) {
    const collection = await userConnect();
    const result = await collection.deleteOne({ _id: new ObjectId(userId) });
    return result;
  }
}

export default User;
