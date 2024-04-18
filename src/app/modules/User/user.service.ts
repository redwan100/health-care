import { Prisma, UserRole, UserStatus } from "@prisma/client";
import bcrypt from "bcrypt";
import { Request } from "express";
import config from "../../../config";
import { fileUploader } from "../../../helpers/fileUploader";
import { paginationHelper } from "../../../helpers/paginationHelpar";
import prisma from "../../../shared/prisma";
import { TAuthUser } from "../../../types/common";
import { TUploadedFile } from "../../types/fileUpload";
import { TPaginationOptions } from "../../types/pagination";
import { userSearchAbleFields } from "./user.constant";

// ! CREATE A ADMIN
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

const createDoctorIntoDB = async (req: any) => {
  // *if create any problem remove TUploadedFile type
  
  const file: TUploadedFile = req.file;
  const doctorData = req.body;
  if (file) {
    const cloudinary = await fileUploader.uploadToCloudinary(req.file);
    req.body.doctor.profilePhoto = cloudinary?.secure_url;
  }

  const hashedPassword = await bcrypt.hash(
    doctorData.password,
    Number(config.salt_round)
  );

  const userData = {
    email: doctorData.doctor.email,
    password: hashedPassword,
    role: UserRole.DOCTOR,
  };

  const result = await prisma.$transaction(async (transactionClient) => {
    await transactionClient.user.create({
      data: userData,
    });

    const createdDoctorData = await transactionClient.doctor.create({
      data: doctorData.doctor,
    });

    return {
      createdDoctorData,
    };
  });

  return result;
};

// ! CREATE A PATIENT
const createPatientIntoDB = async (req: any) => {
  // *if create any problem remove TUploadedFile type
  const file: TUploadedFile = req.file;
  const patientData = req.body;
  if (file) {
    const cloudinary = await fileUploader.uploadToCloudinary(req.file);
    req.body.patient.profilePhoto = cloudinary?.secure_url;
  }

  const hashedPassword = await bcrypt.hash(
    patientData.password,
    Number(config.salt_round)
  );

  const userData = {
    email: patientData.patient.email,
    password: hashedPassword,
    role: UserRole.PATIENT,
  };

  const result = await prisma.$transaction(async (transactionClient) => {
    await transactionClient.user.create({
      data: userData,
    });

    const createdPatientData = await transactionClient.patient.create({
      data: patientData.patient,
    });

    return {
      createdPatientData,
    };
  });

  return result;
};

const getAllUserFromDB = async (params: any, options: TPaginationOptions) => {
  const andConditions: Prisma.UserWhereInput[] = [];

  const { searchTerm, ...filteredData } = params;
  const { limit, skip, page } = paginationHelper.calculatePagination(options);

  if (params.searchTerm) {
    andConditions.push({
      OR: userSearchAbleFields.map((field) => ({
        [field]: {
          contains: params.searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (Object.keys(filteredData).length > 0) {
    andConditions.push({
      AND: Object.keys(filteredData).map((key) => ({
        [key]: {
          equals: (filteredData as any)[key],
        },
      })),
    });
  }

  const whereCondition: Prisma.UserWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.user.findMany({
    where: whereCondition,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? {
            [options.sortBy]: options.sortOrder,
          }
        : {
            createdAt: "desc",
          },
    select: {
      id: true,
      email: true,
      role: true,
      needPasswordChange: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      admin: true,
      doctor: true,
      patient: true,
    },
  });

  const total = await prisma.user.count({
    where: whereCondition,
  });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const changeProfileStatusIntoDB = async (id: string, payload: UserStatus) => {
  await prisma.user.findUniqueOrThrow({
    where: { id },
  });
  const updated = await prisma.user.update({
    where: {
      id,
    },
    data: payload,
  });

  return updated;
};

const getMyProfile = async (user: TAuthUser) => {
  const userInfo = await prisma.user.findUniqueOrThrow({
    where: {
      email: user?.email,
      status: UserStatus.ACTIVE,
    },
    select: {
      email: true,
      role: true,
      needPasswordChange: true,
      status: true,
    },
  });

  let profileInfo;
  if (user.role === UserRole.SUPER_ADMIN) {
    profileInfo = await prisma.admin.findUnique({
      where: {
        email: userInfo.email,
      },
    });
  } else if (user.role === UserRole.ADMIN) {
    profileInfo = await prisma.admin.findUnique({
      where: {
        email: userInfo.email,
      },
    });
  } else if (user.role === UserRole.DOCTOR) {
    profileInfo = await prisma.doctor.findUnique({
      where: {
        email: userInfo.email,
      },
    });
  } else if (user.role === UserRole.PATIENT) {
    profileInfo = await prisma.patient.findUnique({
      where: {
        email: userInfo.email,
      },
    });
  }

  return {
    ...userInfo,
    ...profileInfo,
  };
};
const updateMyProfile = async (user: TAuthUser, req: Request) => {
  const userInfo = await prisma.user.findUniqueOrThrow({
    where: {
      email: user.email,
      status: UserStatus.ACTIVE,
    },
  });

  const file = req.file;

  if (file) {
    const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
    req.body.profilePhoto = uploadToCloudinary?.secure_url;
  }

  let profileInfo;
  if (user.role === UserRole.SUPER_ADMIN) {
    profileInfo = await prisma.admin.update({
      where: {
        email: userInfo.email,
      },
      data: req.body,
    });
  } else if (user.role === UserRole.ADMIN) {
    profileInfo = await prisma.admin.update({
      where: {
        email: userInfo.email,
      },
      data: req.body,
    });
  } else if (user.role === UserRole.DOCTOR) {
    profileInfo = await prisma.doctor.update({
      where: {
        email: userInfo.email,
      },
      data: req.body,
    });
  } else if (user.role === UserRole.PATIENT) {
    profileInfo = await prisma.patient.update({
      where: {
        email: userInfo.email,
      },
      data: req.body,
    });
  }

  return profileInfo;
};

export const userService = {
  createAdminIntoDB,
  createDoctorIntoDB,
  createPatientIntoDB,
  getAllUserFromDB,
  changeProfileStatusIntoDB,
  getMyProfile,
  updateMyProfile,
};
