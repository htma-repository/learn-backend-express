import { MongoClient, ServerApiVersion } from "mongodb";

const username = process.env.MONGODB_USERNAME;
const password = process.env.MONGODB_PASSWORD;

const uri = `mongodb+srv://${username}:${password}@onlinestore.rb6p58z.mongodb.net/?retryWrites=true&w=majority`;

export const mongoConnect = async () => {
  // Create a MongoClient with a MongoClientOptions object to set the Stable API version
  try {
    const client = await MongoClient.connect(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    });
    return client;
  } catch (error) {
    throw new Error(error);
  }
};
export const dbConnect = async () => {
  const client = await mongoConnect();
  const db = client.db("shop");
  return db;
};
