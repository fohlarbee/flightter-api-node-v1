import { PrismaClient } from "@prisma/client";

export async function prismaConnect() {
  await new PrismaClient()
    .$connect()
    .then(() => {
      console.log("connected to db");
    })
    .catch((err) => {
      throw new Error(err);
    });
}
