import register from "#/utils/register";
import { Prisma } from "@prisma/client";
import { RequestHandler } from "express";

const registerUser: RequestHandler = async(req,res):Promise<any> => {
    try {
        const {email, userName, password, auth_provider} = req.body;
        console.log(userName)

        if(!userName  || !email) {
            return res.status(403).json({status: false, message: "invalid  params"})
        }

        const newUser = await register(email,userName, auth_provider, password);

        return res.status(201).json({status: true, message: "User registered successfully", user: newUser})






        
    } catch (error) {
        if(error instanceof Error) {
            return res.status(409).json({status: false, message: error.message})
        }
        
    }

}

export default registerUser;