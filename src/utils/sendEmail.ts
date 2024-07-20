import { env } from "#/lib/env";
import * as nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  priority: "high",
  service: "gmail",
  from: "flightter.com@gmail.com",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: env.AUTH_EMAIL,
    pass: env.AUTH_PASSWORD,
  },
});

transporter.verify((error) => {
  if (error instanceof Error) {
    return error.message;
  } else {
    console.info("Ready to send email");
  }
});

const sendEmail = async (mailOptions: any) => {
  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    if (error instanceof Error) return { success: false, mssg: error.message };
  }
};
export default sendEmail;
