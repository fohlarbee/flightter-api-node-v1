import editProfile from "#/utils/editProfile";
import { Prisma } from "@prisma/client";
import { RequestHandler } from "express";

export const editUserProfile: RequestHandler = async (
  req,
  res,
): Promise<Prisma.UserUpdateInput | any> => {
  try {
    const { firstName, lastName, avatar, userName, id } = req.body;

    const updatedUser = await editProfile({
      firstName,
      userName,
      lastName,
      avatar,
      id: req.user.id,
    });

    return res.status(200).json({ status: true, data: { updatedUser } });
  } catch (error) {
    if (error instanceof Error) {
      return res
        .status(400)
        .json({ status: false, data: { error: error.message } });
    }
  }
};
