import { editUserProfile } from "#/handlers/userHandler";
import { IsAuth } from "#/middlewares/isAuth";
import { validateUserInput } from "#/middlewares/validateUserUpdateProfileInput";
import { Router } from "express";

export const userRouter = Router();

userRouter.use(IsAuth);

userRouter.post("/editprofile", validateUserInput, editUserProfile);
