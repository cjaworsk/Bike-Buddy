import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
if (!uri) {
  throw new Error(
    "⚠️ Please define the MONGODB_URI environment variable in your .env.local file"
  );
}

const options = {};

// Extend the global type so we can store the client promise safely
declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

// Reuse client across hot reloads in dev, create new in prod
const clientPromise: Promise<MongoClient> =
  global._mongoClientPromise ??
  new MongoClient(uri, options).connect();

if (!global._mongoClientPromise) {
  global._mongoClientPromise = clientPromise;
}

export default clientPromise;

