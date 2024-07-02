import { prisma } from "#/lib/prismaConnect"
import { genSalt } from "bcryptjs";
import hashData from "./hashData";


enum verificationTypeEnum {
    GOOGLE = "GOOGLE",
    FACEBOOK= "FACEBOOK",
  }

const registerSSO = async(email:string, userName: string, authProvider:string) => {

    
    const userExists = await prisma.user.findUnique({where:{email} });

    if (userExists) 
        throw new Error('Email already registered');  

   
        const verificationType = verificationTypeEnum[authProvider as keyof typeof verificationTypeEnum];

        let userDocs = ({
            email,
            userName,
            verificationType,
            isVerified:true

        });
        const user = await prisma.user.create({data:userDocs});

        return user;

    }

export default registerSSO