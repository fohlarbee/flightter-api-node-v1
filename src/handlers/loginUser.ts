import { login } from "#/utils/login";
import { RequestHandler } from "express";

const loginUser: RequestHandler = async(req, res) => {
    try {

        const {email, password} = req.body;

        const {token, user} = await login(email, password);

        return res.status(200).json({status: true, message: "User logged in successfully", user: user, token })


        
    } catch (error) {
        if(error instanceof Error) {
            return res.status(401).json({status:false, msg: error.message})
        }
        
    }
}

export default loginUser;