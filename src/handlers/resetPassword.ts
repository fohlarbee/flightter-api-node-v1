import { prisma } from "#/lib/prismaConnect";
import hashData from "#/utils/hashData";
import verifyOTP from "#/utils/verifyOTP";
import { RequestHandler } from "express";

export const resetPassword: RequestHandler = async (req, res) => {
  try {
    const { email, newPassword, otp } = req.body;

    if (!email || !newPassword || !otp) {
      return res
        .status(401)
        .json({ success: false, mssg: "All fields must be filled" });
    }

    // verify otp
    const isMatched = await verifyOTP(email, otp);
    if (!isMatched) {
      return res.status(401).json({ success: false, mssg: "Invalid OTP" });
    }

    const passwordCheck =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*]).{8,}$/;

    if (!passwordCheck.test(newPassword))
      throw new Error(
        "Password must contain at least 8 characters, including uppercase letters, lowercase letters, numbers, and special characters.",
      );

    // update password in db
    await prisma.user.update({
      where: { email },
      data: { password: await hashData(newPassword) },
    });

    // return success message
    return res
      .status(200)
      .json({ success: true, mssg: "Password reset successful" });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(409).json({ status: false, msg: error.message });
    }
  }
};
