import register from "#/utils/register";
import registerSSO from "#/utils/registerSSO";
import { Prisma } from "@prisma/client";
import { RequestHandler } from "express";

const registerUser: RequestHandler = async (req, res): Promise<any> => {
  try {
    const { email, userName, password, auth_provider } = req.body;

    if (!userName || !email) {
      return res
        .status(403)
        .json({ status: false, message: "invalid  params" });
    }
    if (password) {
      const newUser = await register(req.body);

      return res
        .status(201)
        .json({
          status: true,
          message: "User registered successfully",
          user: newUser,
        });
    } else {
      const newUser = await registerSSO(email, userName, auth_provider);
      return res
        .status(201)
        .json({
          status: true,
          message: "User registered successfully",
          user: newUser,
        });
    }
  } catch (error) {
    if (error instanceof Error) {
      return res.status(409).json({ status: false, message: error.message });
    }
  }
};

export default registerUser;
