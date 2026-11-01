import dns from "node:dns";

dns.setServers(["8.8.8.8", "8.8.4.4"]);

import "dotenv/config";

import express from "express";
import cors from "cors";

import {
  toNodeHandler,
  fromNodeHeaders,
} from "better-auth/node";

import { auth } from "./lib/auth.js";
import { db } from "./lib/db.js";

const app = express();

const PORT = Number(process.env.PORT) || 5000;

// CORS configuration
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  })
);

// Better Auth handler must come before express.json()
app.all("/api/auth/*splat", toNodeHandler(auth));

app.use(express.json());

// Health check + MongoDB connection test
app.get("/api/health", async (_req, res) => {
  try {
    await db.command({ ping: 1 });

    return res.status(200).json({
      success: true,
      message: "SocialConnect server and MongoDB connected!",
    });
  } catch (error) {
    console.error("MongoDB connection error:", error);

    return res.status(500).json({
      success: false,
      message: "MongoDB connection failed",
    });
  }
});

// Current logged-in user
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

// Start server
app.listen(PORT, () => {
  console.log(
    `SocialConnect server running on http://localhost:${PORT}`
  );
});
