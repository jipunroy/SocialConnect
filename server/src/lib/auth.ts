
import "dotenv/config";

import { betterAuth } from "better-auth";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { jwt } from "better-auth/plugins";
import {
  APIError,
  createAuthMiddleware,
} from "better-auth/api";

import { db } from "./db.js";

export const auth = betterAuth({
  appName: "SocialConnect",

  baseURL: process.env.BETTER_AUTH_URL!,

  secret: process.env.BETTER_AUTH_SECRET!,

  trustedOrigins: [
    process.env.CLIENT_URL || "http://localhost:3000",
  ],

  database: mongodbAdapter(db),

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
  },

  socialProviders: {
    ...(process.env.GOOGLE_CLIENT_ID &&
    process.env.GOOGLE_CLIENT_SECRET
      ? {
          google: {
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          },
        }
      : {}),
  },

  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      if (ctx.path !== "/sign-up/email") {
        return;
      }

      const password = ctx.body?.password;

      if (
        typeof password !== "string" ||
        password.length < 6 ||
        !/[A-Z]/.test(password) ||
        !/[a-z]/.test(password)
      ) {
        throw new APIError("BAD_REQUEST", {
          message:
            "Password must contain uppercase, lowercase and at least 6 characters.",
        });
      }
    }),
  },

  plugins: [
    jwt(),
  ],
});
