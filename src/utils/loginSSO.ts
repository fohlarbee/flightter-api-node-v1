import CustomError from "#/lib/customError";
import { env } from "#/lib/env";
import { prisma } from "#/lib/prismaConnect";
import { verificationType } from "@prisma/client";
import { compare } from "bcryptjs";
import * as jwt from 'jsonwebtoken'


enum VerificationType{
    GOOGLE = "GOOGLE",
    FACEBOOK= "FACEBOOK",
  
}

export const loginSSO = async (email:string ) => {

        const user = await prisma.user.findUnique({ where:{email} })

        if (!user)
            throw new CustomError( "User not found", false );

        if (!Object.values(VerificationType).includes(user.verificationType as VerificationType)) {
            throw new CustomError(
              "User verification type is not valid for SSO login. Valid types are: GOOGLE, FACEBOOK.",
              false
            );
          }
            const token = jwt.sign({ id: user?.id.toString() }, env.SECRET_KEY, {
                expiresIn: env.TOKEN_EXPIRY,
                issuer: 'flightter',
            })
            return {user, token}
}     
export default loginSSO;

        

      

