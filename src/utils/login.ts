import CustomError from "#/lib/customError";
import { env } from "#/lib/env";
import { prisma } from "#/lib/prismaConnect";
import { compare } from "bcryptjs";
import * as jwt from 'jsonwebtoken'


export const login = async (email:string, password: string) => {

        const user = await prisma.user.findUnique({ where:{email} })

        if (!user)
            throw new CustomError( "User not found", false );

        const isMatched = await compare(password, user.password)

        if (!isMatched)
            throw new CustomError( "Password Mismatch", false );


        const token = jwt.sign({ id: user?.id.toString() }, env.SECRET_KEY, {
            expiresIn: env.TOKEN_EXPIRY,
            issuer: 'flightter',
        })
        return {user, token}
    } 

