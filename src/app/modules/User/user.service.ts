import { PrismaClient, UserRole } from "@prisma/client";

const prisma = new PrismaClient();

import bcrypt from "bcrypt";

const createAdminIntoDB = async (payload: any) => {
  const hashedPassword = await bcrypt.hash(payload.password, 10);

  const userData = {
    email: payload.admin.email,
    password: hashedPassword,
    role: UserRole.ADMIN,
  };

  const result = await prisma.$transaction(async (transactionClient) => {
    const createdUserData = await transactionClient.user.create({
      data: userData,
    });

    const createdAdminData = await transactionClient.admin.create({
      data: payload.admin,
    });

    return {
      createdUserData,
      createdAdminData,
    };
  });

  return result;
};

export const userService = {
  createAdminIntoDB,
};
