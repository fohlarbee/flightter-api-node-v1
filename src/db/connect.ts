import { PrismaClient } from "@prisma/client";



export async function prismaConnect(){

 await new PrismaClient({omit:{user:{password:true}}}).$connect().then(() => {
    console.log('connected to prisma')
  
  }).catch((err) => {
    throw new Error(err);
 })
}

    