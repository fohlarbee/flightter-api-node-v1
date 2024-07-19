import { login } from "#/utils/login";
import loginSSO from "#/utils/loginSSO";
import { RequestHandler } from "express";

const loginUser: RequestHandler = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (password && email) {
      const {  token } = await login(email, password);

      return res
        .status(200)
        .json({
          status: true,
          message: "User logged in successfully",
          data: { token },
        });
    } else if (!password && email) {
      const {  token } = await loginSSO(email);
      return res
        .status(200)
        .json({
          status: true,
          message: "User logged in successfully",
          data: { token },
        });
    }
  } catch (error) {
    if (error instanceof Error) {
      return res.status(401).json({ status: false, msg: error.message });
    }
  }
};

export default loginUser;
