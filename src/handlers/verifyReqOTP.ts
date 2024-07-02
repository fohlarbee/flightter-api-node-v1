import verifyOTP from "#/utils/verifyOTP";
import { RequestHandler } from "express";

export const verifyReqOTP: RequestHandler = async(req,res) => {
    try {
        const { email, otp } = req.body;
        console.log(email, otp)

        if (!email || !otp) {
            return res.status(401).json({ success: false, mssg: 'All fields must be filled' })

        }

        const isVerified = await verifyOTP(email, otp);
        if(isVerified === true) {
           return res.status(200).json({success:true, mssg: 'OTP Verified'})
        }


        
    } catch (error) {
        if(error instanceof Error) {
            return res.status(409).json({status:false, msg:error.message})
        }
        
    }
}