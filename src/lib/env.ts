import { cleanEnv, str } from "envalid";

import * as dotenv from "dotenv";
dotenv.config();

export const env = cleanEnv(process.env, {
  PORT: str(),
  AUTH_EMAIL: str(),
  AUTH_PASSWORD: str(),
  DATABASE_URL: str(),
  SECRET_KEY: str(),
  TOKEN_EXPIRY: str(),
  REDIS_URL: str(),
  CLOUDINARY_CLOUD_NAME: str(),
  CLOUDINARY_API_KEY: str(),
  CLOUDINARY_API_SECRET: str(),
});
