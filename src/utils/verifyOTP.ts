import { prisma } from "#/lib/prismaConnect";
import compareHashData from "./compareHashData";

const verifyOTP = async (email: string, otp: string) => {
  // const user = await prisma.user.findUnique({where: {email}});
  // if(!user) throw new CustomError('User not found', false)

  // const cutoffDate = new Date(Date.now() - 1 * 3600000); // n hours ago

  const matchedOTPRecords = await prisma.otp.findMany({
    where: { email },
    orderBy: { createdAt: "desc" },
  });

  if (!matchedOTPRecords) {
    throw new Error("No OTP record found");
  }

  //check if code is expired

  const recentOtpRecord = matchedOTPRecords[0];

  const { expiresAt } = recentOtpRecord;

  if (new Date(expiresAt).getTime().toString() <= Date.now().toString()) {
    await prisma.otp.deleteMany({ where: { email } });
    throw new Error("OTP expired");
  }

  // verify code, if not expired

  const hashedOTP = recentOtpRecord.otp;
  const validOTP = await compareHashData(otp, hashedOTP);

  if (!validOTP) {
    throw new Error("Invalid OTP signature");
  }

  await prisma.otp.updateMany({
    where: { email },
    data: { isVerified: true },
  });

  return true;
};

export default verifyOTP;
