import { Admin, Prisma, UserStatus } from "@prisma/client";
import { paginationHelper } from "../../../helpers/paginationHelpar";
import prisma from "../../../shared/prisma";
import { TPaginationOptions } from "../../types/pagination";
import { adminSearchAbleFields } from "./admin.constant";
import { TAdminFilterParams } from "./admin.types";

const getAllAdminFromDB = async (
  params: TAdminFilterParams,
  options: TPaginationOptions
) => {
  const andConditions: Prisma.AdminWhereInput[] = [];

  const { searchTerm, ...filteredData } = params;
  const { limit, skip, page } = paginationHelper.calculatePagination(options);

  if (params.searchTerm) {
    andConditions.push({
      OR: adminSearchAbleFields.map((field) => ({
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

  andConditions.push({
    isDeleted: false,
  });

  const whereCondition: Prisma.AdminWhereInput = { AND: andConditions };

  const result = await prisma.admin.findMany({
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
  });

  const total = await prisma.admin.count({
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

const getSingleAdminFromDB = async (id: string): Promise<Admin | null> => {
  await prisma.admin.findUniqueOrThrow({ where: { id } });
  const result = await prisma.admin.findUnique({
    where: {
      id,
      isDeleted: false,
    },
  });

  return result;
};

const updateAdminIntoDB = async (
  id: string,
  payload: Partial<Admin>
): Promise<Admin | null> => {
  await prisma.admin.findUniqueOrThrow({
    where: { id, isDeleted: false },
  });

  const result = await prisma.admin.update({
    where: { id },
    data: payload,
  });

  return result;
};

const deleteAdminFromDB = async (id: string) => {
  await prisma.admin.findUniqueOrThrow({
    where: { id },
  });

  const result = await prisma.$transaction(async (transactionClient) => {
    const adminDeletedData = await transactionClient.admin.delete({
      where: { id },
    });

    await transactionClient.user.delete({
      where: {
        email: adminDeletedData.email,
      },
    });

    return {
      adminDeletedData,
    };
  });

  return result;
};

const softDeleteAdminFromDB = async (id: string) => {
  await prisma.admin.findUniqueOrThrow({
    where: { id, isDeleted: false },
  });

  const result = await prisma.$transaction(async (transactionClient) => {
    const adminDeletedData = await transactionClient.admin.update({
      where: { id },
      data: {
        isDeleted: true,
      },
    });

    await transactionClient.user.update({
      where: {
        email: adminDeletedData.email,
      },
      data: {
        status: UserStatus.DELETED,
      },
    });

    return {
      adminDeletedData,
    };
  });

  return result;
};

export const AdminService = {
  getAllAdminFromDB,
  getSingleAdminFromDB,
  updateAdminIntoDB,
  deleteAdminFromDB,
  softDeleteAdminFromDB,
};
