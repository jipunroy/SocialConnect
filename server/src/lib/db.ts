
import "dotenv/config";

import { MongoClient } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is missing from .env");
}

const mongoClient = new MongoClient(MONGODB_URI);

export const db = mongoClient.db(
  process.env.MONGODB_DB_NAME || "socialconnect"
);
