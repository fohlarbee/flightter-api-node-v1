import { Request, Response } from "express";
import * as dotenv from "dotenv";
import { env } from "./lib/env";
import { prismaConnect } from "./db/connect";
import cors from "cors";
import helmet from "helmet";
import { corsOptions } from "./lib/corsOptions";
import { limiter } from "./lib/rateLimiter";
import authRouter from "./routers/auth";
import { userRouter } from "./routers/user";
// const http = require('node:http');
import express from "express";
import * as cron from "node-cron";
import axios from "axios";
// import "../src/db/redis";
import { reelRouter } from "./routers/reels-router";

dotenv.config();

const app = express();

app.use(express.json());
app.use(helmet());
app.use(limiter);
app.use(cors(corsOptions));

//endpoints
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/reel", reelRouter);
app.use("/api/v1/reels", reelRouter);

cron.schedule("*/10 * * * *", async () => {
  await axios
    .get("https://flightter-api-node-v1.onrender.com/ping")
    .then((response) => console.log(`server pinged ${response}`))
    .catch((error) => {
      if (error instanceof Error) {
        console.log(error.message);
      }
    });
});

app.get("/", (req: Request, res: Response) => {
  res.send("Flightter server is running");
});

async function init() {
  await prismaConnect();
  const server = app.listen(process.env.PORT || env.PORT, () => {});
  process.on("SIGINT", () => {
    server.close(() => {});
  });
}

init();
