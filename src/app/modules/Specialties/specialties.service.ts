import { Request } from "express";
import { fileUploader } from "../../../helpers/fileUploader";
import prisma from "../../../shared/prisma";

const createSpecialtiesIntoDB = async (req: Request) => {
  const file = req.file;
  if (file) {
    const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
    req.body.icon = uploadToCloudinary?.secure_url;
  }

  const result = await prisma.specialties.create({
    data: req.body,
  });

  return result;
};

const getSpecialtiesFromDB = async () => {
  const result = await prisma.specialties.findMany();
  return result;
};

const deleteSpecialtiesFromDB = async (id: string) => {
  const result = await prisma.specialties.delete({
    where: { id },
  });
  return result;
};

export const SpecialtiesService = {
  createSpecialtiesIntoDB,
  getSpecialtiesFromDB,
  deleteSpecialtiesFromDB,
};
