import jwt, { JsonWebTokenError } from "jsonwebtoken";
import { RequestHandler, Response, NextFunction, Request } from "express";
import { env } from "#/lib/env";
import { prisma } from "#/lib/prismaConnect";

declare global {
  namespace Express {
    interface Request {
      user: {
        [key: string]: any;
      };
    }
  }
}

export const IsAuth: RequestHandler = async (req, res, next) => {
  try {
    const acessToken = req.headers.authorization;
    if (!acessToken) {
      return res
        .status(401)
        .json({ success: false, mssg: "Please login to continue" });
    }
    const token = acessToken?.split("Bearer ")[1];
    if (!token) {
      return res
        .status(403)
        .json({ success: false, mssg: "Unauhorized access" });
    }

    const payload = jwt.verify(token, env.SECRET_KEY) as { id: string };
    if (!payload) {
    }

    const user = await prisma.user.findUnique({ where: { id: +payload.id } });
    if (!user) {
      return res
        .status(403)
        .json({ success: false, mssg: "Unauthorized access" });
    }
    req.user = user;
  } catch (error) {
    if (error instanceof JsonWebTokenError) {
      return res.status(404).json({ success: false, mssg: error.message });
    } else {
      return res.status(403).json({ success: false, mssg: error });
    }
  }

  next();
};
``;
