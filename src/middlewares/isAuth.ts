

import jwt, { JsonWebTokenError } from 'jsonwebtoken'
import { RequestHandler, Response, NextFunction, Request } from "express";
import { env } from '#/lib/env';
import { prisma } from '#/lib/prismaConnect';

declare global {
    namespace Express {
        interface Request {
            user: {
                [key: string]: any
            }
        }
    }
}



export const IsAuth: RequestHandler = async (req, res, next) => {
    try {

        const authToken = req.headers.authorization;
        if (!authToken) {
            return res.status(401).json({ success: false, mssg: 'Please login to continue' })
        }
        const token = authToken?.split('Bearer ')[1]
        if (!token) {

            return res.status(403).json({ success: false, mssg: "Unauhorized access" })
        }

        // console.log(token)

        const payload = jwt.verify(token, env.SECRET_KEY) as { id: string }

        // console.log('Payload:', payload);

        if (!payload) {
        }

        // console.log(payload)
        const user = await prisma.user.findUnique({where:{id:+payload.id}})
        // console.log(user)
        if (!user) {
            return res.status(403).json({ success: false, mssg: "Unauthorized access" })
        }
        req.user = user
        // console.log({success:true, mssg: user?._id}

    } catch (error) {
        if (error instanceof JsonWebTokenError) {
            return res.status(404).json({ success: false, mssg: error.message })

        }
        else {
            return res.status(403).json({ success: false, mssg: "something went wrong" })
        }
    }

    next();

}
// Extend the Request interface to include the user property
// interface CustomRequest extends Request {
//     user?: {
//         [key: string]: any
//     };
// }

export const isAdmin: RequestHandler = async (req, res, next) => {
    try {
        if (req.user?.role.toString() !== 'admin') {
            return res.status(403).json(`User role ${req.user.role} is not authorized to access this route`)

        }
        // return (req: Request, res: Response, next: NextFunction) => {
        //     if (!req.user || !req.user.role) {
        //         return res.status(403).json('User role not defined. Please make sure the user role is defined.')
        //     }

        //     if (req.user.role != 'admin') {
        //         //console.log(req.user)
        //         return res.status(403).json(`User role ${req.user.role} is not authorized to access this route`)
        //     }
        //  }
        next()
    }

    catch (error) {
        if (error instanceof Error) {
            return res.status(400).json({ success: false, mssg: error.message })
        }

    }
}
``






























