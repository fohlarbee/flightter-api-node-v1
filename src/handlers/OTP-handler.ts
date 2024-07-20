import { env } from "#/lib/env";
import { prisma } from "#/lib/prismaConnect";
import { generateOTP } from "#/utils/generateOTP";
import hashData from "#/utils/hashData";
import sendEmail from "#/utils/sendEmail";
import { Prisma } from "@prisma/client";
type OTPREQ = {
  subject: string;
  email: string;
  purpose: string;
  duration: number;
  // for: string
};

export const sendOTP = async ({
  subject,
  email,
  purpose,
  duration = 1,
}: OTPREQ): Promise<Prisma.OtpCreateInput | undefined> => {
  if (!subject || !email || !purpose) {
    throw Error("All fields must be provided");
  }

  // Check existing OTP records for rate limiting
  const n = 1; // Adjust n to your desired time window (in hours)
  const cutoffDate = new Date(Date.now() - n * 3600000); // n hours ago

  // clear old OTP records
  const otpRecords = await prisma.otp.findMany({
    where: { email, createdAt: { gt: cutoffDate } },
  });

  // Check if user has already received 5 OTPs within n hours

  if (otpRecords.length >= 5) {
    const timeToWait = 1;
    const waitTimeInMs = timeToWait * 3600000; // Convert to milliseconds
    const nextSendTime = new Date(Date.now() + waitTimeInMs);

    throw new Error(
      `Too many OTP requests for this email within the past ${n} hour(s). Please try again after ${nextSendTime.toLocaleTimeString()}.`,
    );
  }

  // generate OTP
  const generatedOTP = await generateOTP();

  //mail options

  const mailOptions = {
    from: env.AUTH_EMAIL,
    to: email,
    subject,
    html: `
            <div style="background-color: #f0f8ff; padding: 30px; border-radius: 5px; margin: 0 auto; max-width: 600px;">
              <h1 style="font-family: sans-serif; font-size: 24px; color: #333; text-align: center;">Your One-Time Password (OTP)</h1>
              <p style="font-family: sans-serif; font-size: 16px; line-height: 1.5; color: #666; text-align: center;">
                Hi there,
              </p>
              <p style="font-family: sans-serif; font-size: 16px; line-height: 1.5; color: #666; text-align: center;">
                Here's your one-time password (OTP). ${purpose}:
              </p>
              <h2 style="font-family: monospace; font-size: 32px; font-weight: bold; color: #333; text-align: center; margin: 20px 0;">
                ${generatedOTP}
              </h2>
              <p style="font-family: sans-serif; font-size: 14px; line-height: 1.5; color: #999; text-align: center;">
                This code expires in ${duration} hour.
              </p>
            </div>
          `,
    // html: `<div style=""><p>${purpose}</p style="font-size:15px;"><p style="color:#114232; font-size:25px; letter-spacing:2px;"><b>${generatedOTP}</b></p>
    // <p>This code <b>expires in ${duration} minute(s)</b></p></div>`,
  };
  //send OTP to user//
  await sendEmail(mailOptions);

  //Hash OTP
  const hashedOTP = await hashData(generatedOTP!);

  //Save OTP record
  const newOTPRecord: Prisma.OtpCreateInput = {
    email,
    otp: hashedOTP,
    for: "signup",
    isVerified: false,
    createdAt: new Date(Date.now()),
    expiresAt: new Date(Date.now() + 3600000),
  };

  // return newOTPRecord;
  await prisma.otp.create({ data: newOTPRecord });

  return newOTPRecord;
};
