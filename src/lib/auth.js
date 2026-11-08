import { expo } from "@better-auth/expo";
import { betterAuth } from "better-auth";
import { username } from "better-auth/plugins";

import { pool } from "../db/pool.js";

const isDevelopment = process.env.NODE_ENV !== "production";

export const auth = betterAuth({
  database: pool,
  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
      firstName: { type: "string", required: true },
      lastName: { type: "string", required: true },
    },
  },
  plugins: [expo(), username({ displayUsername: false })],
  trustedOrigins: ["demoapp://", ...(isDevelopment ? ["exp://", "exp://**"] : [])],
});
