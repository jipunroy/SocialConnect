
import "dotenv/config";

import dns from "node:dns";

// MongoDB DNS configuration
dns.setServers(["8.8.8.8", "8.8.4.4"]);

import express from "express";
import cors from "cors";

import {
  toNodeHandler,
  fromNodeHeaders,
} from "better-auth/node";

import { auth } from "./lib/auth.js";

import {
  db,
  createDatabaseIndexes,
} from "./lib/db.js";

import { requireAuth } from "./middleware/require-auth.js";

import eventRoutes from "./routes/event.routes.js";
import uploadRoutes from "./routes/upload.routes.js";
import impactRoutes from "./routes/impact.routes.js";

// ======================================
// EXPRESS APP
// ======================================

const app = express();

const PORT = Number(process.env.PORT) || 5000;

// ======================================
// CORS CONFIGURATION
// ======================================

const allowedOrigins = [
  process.env.CLIENT_URL,
  "http://localhost:3000",
].filter((origin): origin is string => Boolean(origin));

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "OPTIONS",
    ],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],
  })
);

// ======================================
// BETTER AUTH HANDLER
// Must come before express.json()
// ======================================

app.all("/api/auth/*splat", toNodeHandler(auth));

// ======================================
// EXPRESS JSON MIDDLEWARE
// ======================================

app.use(express.json());

// ======================================
// UPLOAD ROUTES
// ======================================

app.use("/api/upload", uploadRoutes);

// ======================================
// EVENT ROUTES
// ======================================

app.use("/api/events", eventRoutes);

// ======================================
// COMMUNITY IMPACT ROUTES
// ======================================

app.use("/api/impact", impactRoutes);

// ======================================
// HEALTH CHECK + MONGODB CONNECTION
// ======================================

app.get("/api/health", async (_req, res) => {
  try {
    await db.command({ ping: 1 });

    return res.status(200).json({
      success: true,
      message:
        "SocialConnect server and MongoDB connected!",
    });
  } catch (error) {
    console.error("MongoDB connection error:", error);

    return res.status(500).json({
      success: false,
      message: "MongoDB connection failed",
    });
  }
});

// ======================================
// CURRENT LOGGED-IN USER
// ======================================

app.get("/api/me", async (req, res) => {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    return res.status(200).json({
      success: true,
      user: session.user,
    });
  } catch (error) {
    console.error("Session error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to get user session",
    });
  }
});

// ======================================
// PROTECTED TEST ROUTE
// ======================================

app.get(
  "/api/protected-test",
  requireAuth,
  (_req, res) => {
    return res.status(200).json({
      success: true,
      message: "You are authenticated!",
      user: res.locals.user,
    });
  }
);

// ======================================
// ROOT ROUTE
// ======================================

app.get("/", (_req, res) => {
  return res.status(200).json({
    success: true,
    message: "Welcome to SocialConnect API!",
  });
});

// ======================================
// START SERVER + CREATE DATABASE INDEXES
// ======================================

app.listen(PORT, async () => {
  console.log(
    `SocialConnect server running on port ${PORT}`
  );

  try {
    await createDatabaseIndexes();

    console.log("Database indexes are ready!");
  } catch (error) {
    console.error(
      "Database index creation failed:",
      error
    );
  }
});
