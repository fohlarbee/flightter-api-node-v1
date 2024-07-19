import { env } from "#/lib/env";
import { createClient } from "redis";

export const redisClient = createClient({ url: env.REDIS_URL });

const redisConnect = async () => {
  // redisClient.on("error", (err) => console.log("Redis Client Error", err));

  await redisClient
    .connect()
    .then(() => console.log("connected to redis"))
    .catch((err) => console.log("Error connecting to redis"));
};
redisConnect();

const getValue = async function (key: string) {
  try {
    let value: any;

    value = await redisClient.json.get(`user:${key}`);

    return value;
  } catch (error) {
    console.log("Error getting value for key ", +key);
    throw error;
  }
};

const setValue = async function (key: string, value: string) {
  try {
    const data = await redisClient.json.set(`user:${key}`, "$", value);
    console.log("data cached");
    return data;
  } catch (error) {
    console.log("Error while setting value for key: " + key);
  }
};

export { getValue, setValue };
