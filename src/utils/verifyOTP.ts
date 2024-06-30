import { prisma } from "#/lib/prismaConnect";
import { error } from "console";
import compareHashData from "./compareHashData";

 const verifyOTP = async(email:string, otp:string) => {


    // try {
      const cutoffDate = new Date(Date.now() - 1 * 3600000); // n hours ago

        const matchedOTPRecords = await prisma.otp.findMany({where:{email}, orderBy:{createdAt:'desc'} })
        console.log(matchedOTPRecords)
    
        if (!matchedOTPRecords) {
            throw new Error('No OTP record found')
        }
    
        //check if code is expired

        const recentOtpRecord = matchedOTPRecords[0]

        const { expiresAt } = recentOtpRecord;
        console.log(expiresAt)
    
    
        if (new Date(expiresAt).getTime().toString() <= Date.now().toString()) {
            await prisma.otp.deleteMany({where:{email}  })
            throw new Error('OTP expired')
        }
    
          // verify code, if not expired

          const hashedOTP = recentOtpRecord.otp;
          const validOTP = await compareHashData(otp, hashedOTP);
          console.log(validOTP)
    
          if (!validOTP) {
            throw new Error('Invalid OTP signature')
          }
    
          await prisma.otp.updateMany({
            where: {email},
          data:{isVerified:true}
          });
    
          return true;

    // } catch (error) {
    //     if(error instanceof Error){
    //         console.log(error)
            
    //     }
        
    // }

   
}

export default verifyOTP;