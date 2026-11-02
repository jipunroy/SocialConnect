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

// ======================================
// CREATE DATABASE INDEXES
// ======================================

export async function createDatabaseIndexes() {
  await db.collection("events").createIndex({
    creatorId: 1,
  });

  await db.collection("events").createIndex({
    eventDate: 1,
  });

  await db.collection("eventJoins").createIndex(
    {
      eventId: 1,
      userId: 1,
    },
    {
      unique: true,
    }
  );

  await db.collection("eventJoins").createIndex({
    userId: 1,
  });

  console.log(
    "MongoDB indexes created successfully!"
  );
}