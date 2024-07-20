import CustomError from "#/lib/customError";
import { env } from "#/lib/env";
import { prisma } from "#/lib/prismaConnect";
import { verificationType } from "@prisma/client";
import { compare } from "bcryptjs";
import * as jwt from "jsonwebtoken";

enum VerificationType {
  GOOGLE = "GOOGLE",
  FACEBOOK = "FACEBOOK",
  FLIGHTTER = "FLIGHTTER",
}

export const login = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) throw new CustomError(false, "User not Found", "409");

  const isMatched = await compare(password, user.password!);

  if (!isMatched) throw new CustomError(false, "Password mismatch", "401");

  const token = jwt.sign({ id: user?.id.toString() }, env.SECRET_KEY, {
    expiresIn: env.TOKEN_EXPIRY,
    issuer: "flightter",
  });
  return { token };
};
