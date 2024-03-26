import { UserRole } from "@prisma/client";
import bcrypt from "bcrypt";
import config from "../../../config";
import { fileUploader } from "../../../helpers/fileUploader";
import prisma from "../../../shared/prisma";
import { TUploadedFile } from "../../types/fileUpload";

const createAdminIntoDB = async (req: any) => {
  // *if create any problem remove TUploadedFile type
  const file: TUploadedFile = req.file;
  const adminData = req.body;
  if (file) {
    const cloudinary = await fileUploader.uploadToCloudinary(req.file);
    req.body.admin.profilePhoto = cloudinary?.secure_url;
  }

  const hashedPassword = await bcrypt.hash(
    adminData.password,
    Number(config.salt_round)
  );

  const userData = {
    email: adminData.admin.email,
    password: hashedPassword,
    role: UserRole.ADMIN,
  };

  const result = await prisma.$transaction(async (transactionClient) => {
    await transactionClient.user.create({
      data: userData,
    });

    const createdAdminData = await transactionClient.admin.create({
      data: adminData.admin,
    });

    return {
      createdAdminData,
    };
  });

  return result;
};

export const userService = {
  createAdminIntoDB,
};
