import { PrismaClient } from "@prisma/client";
import { env } from "./env";

export const prisma = new PrismaClient({
  // Replace with your actual database connection details
  datasources: {
    db: {
      url: env.DATABASE_URL,
    },
  },
});
