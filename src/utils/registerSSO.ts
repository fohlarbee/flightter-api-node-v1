import { prisma } from "#/lib/prismaConnect"
import { genSalt } from "bcryptjs";
import hashData from "./hashData";
import { register } from "module";


enum verificationTypeEnum {
    GOOGLE = "GOOGLE",
    FACEBOOK= "FACEBOOK",
  }

  interface signinUpInterface {
    email: string,
    userName: string,
    dob: Date,
    authProvider: string,
}

const registerSSO = async({email, userName, authProvider, dob}:signinUpInterface) => {

    
    const userExists = await prisma.user.findUnique({where:{email} });

    if (userExists) 
        throw new Error('Email already registered');  

   
        const verificationType = verificationTypeEnum[authProvider as keyof typeof verificationTypeEnum];

        let userDocs = ({
            email,
            userName,
            dob,
            verificationType,
            isVerified:true

        });
        const user = await prisma.user.create({data:userDocs});

        return user;

    }

export default registerSSO