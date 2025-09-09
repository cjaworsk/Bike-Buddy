// src/lib/mongodb.ts
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
if (!uri) {
  throw new Error("⚠️ Please define the MONGODB_URI environment variable in your .env.local file");
}

const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

// In dev, reuse the client across hot reloads
if (!(global as any)._mongoClientPromise) {
  client = new MongoClient(uri, options);
  (global as any)._mongoClientPromise = client.connect();
}

clientPromise = (global as any)._mongoClientPromise;

export default clientPromise;

