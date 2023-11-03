import { ServerApiVersion } from "mongodb";
import { connect } from "mongoose";

const username = process.env.MONGODB_USERNAME;
const password = process.env.MONGODB_PASSWORD;

const uri = `mongodb+srv://${username}:${password}@onlinestoremongooseclus.bkhmpgs.mongodb.net/?retryWrites=true&w=majority`;

export async function connectMongoose() {
  return await connect(uri, {
    dbName: "shop",
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });
}
