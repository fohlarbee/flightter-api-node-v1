import CustomError from "#/lib/customError";
import { prisma } from "#/lib/prismaConnect";

interface UpdateDto {
  firstName?: string;
  userName?: string;
  lastName?: string;
  avatar?: string;
  id: number;
}

const editProfile = async ({
  firstName,
  userName,
  lastName,
  avatar,
  id,
}: UpdateDto) => {
  //check if user wants to update username, then do a check if userName already exists
  if (userName) {
    const userExists = await prisma.user.findUnique({ where: { userName } });
    if (userExists) {
      throw new CustomError(false, "User already exists", null);
    }
  }

  // update the user
  const updatedUser = await prisma.user.update({
    where: { id: id },
    data: { firstName, userName, lastName, avatar },
  });

  return updatedUser;
};

export default editProfile;
