import { prisma } from "#/lib/prismaConnect";
import { RequestHandler } from "express";
import { sendOTP } from "./OTP-handler";



export const sendResetMail: RequestHandler = async(req, res, next) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(401).json({ success: false, mssg: 'Provide a valid email' })
        }
        const userExits = await prisma.user.findUnique({where:{email} });

        if (!userExits) {
            return res.status(400).json({ success: false, message: 'No user Records' })
        }

        const OTPDetails = {
            email,
            subject: 'Email Verification',
            purpose: 'Enter the Code below to Proceed to Password Reset',
            for:'ressetPawword',
            duration: 1

        }

        const newOTPRecord = await sendOTP(OTPDetails);


        return res.status(200).json({ success: true, mssg: 'Email sent' })

        
    } catch (error) {
        if(error instanceof Error) {
            return res.status(409).json({status:false, msg:error.message})
        }
        
    }
}