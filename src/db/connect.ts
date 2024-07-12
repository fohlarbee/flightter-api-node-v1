import { PrismaClient } from "@prisma/client";



export async function prismaConnect(){

 await new PrismaClient().$connect().then(() => {
  
  }).catch((err) => {
    throw new Error(err);
 })
}

    