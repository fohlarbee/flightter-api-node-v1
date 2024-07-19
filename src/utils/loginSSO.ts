import CustomError from "#/lib/customError";
import { env } from "#/lib/env";
import { prisma } from "#/lib/prismaConnect";
import { verificationType } from "@prisma/client";
import { compare } from "bcryptjs";
import * as jwt from "jsonwebtoken";

enum VerificationType {
  GOOGLE = "GOOGLE",
  FACEBOOK = "FACEBOOK",
}

export const loginSSO = async (email: string) => {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) throw new CustomError(false, "User not found", null);

  if (
    !Object.values(VerificationType).includes(
      user.verificationType as VerificationType,
    )
  ) {
    throw new CustomError(false, "Invalid loginType", null);
  }

  const token = jwt.sign({ id: user?.id.toString() }, env.SECRET_KEY, {
    expiresIn: env.TOKEN_EXPIRY,
    issuer: "flightter",
  });
  return {  token };
};
export default loginSSO;
