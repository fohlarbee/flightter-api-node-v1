import { getToken } from "#/handlers/getToken";
import loginUser from "#/handlers/loginUser";
import registerUser from "#/handlers/registerUser";
import { resetPassword } from "#/handlers/resetPassword";
import { sendResetMail } from "#/handlers/sendResetOTP";
import { verifyReqOTP } from "#/handlers/verifyReqOTP";
import { Router } from "express";

const authRouter = Router();

authRouter.post("/otp", getToken);
authRouter.post("/otp/verify", verifyReqOTP);
authRouter.post("/register", registerUser);
authRouter.post("/login", loginUser);
authRouter.post("/reset", sendResetMail);
authRouter.post("/reset/verify", resetPassword);

export default authRouter;
