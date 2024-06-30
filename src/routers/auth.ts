import { getToken } from "#/handlers/getToken";
import loginUser from "#/handlers/loginUser";
import registerUser from "#/handlers/registerUser";
import { verifyReqOTP } from "#/handlers/verifyOTP";
import { Router } from "express";

 const authRouter = Router();

authRouter.post('/otp', getToken);
authRouter.post('/otp/verify', verifyReqOTP);
authRouter.post('/register',registerUser)
authRouter.post('/login', loginUser);

export default authRouter;