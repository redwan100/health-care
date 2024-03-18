import { Prisma } from "@prisma/client";
import { paginationHelper } from "../../../helpers/paginationHelpar";
import prisma from "../../../shared/prisma";
import { adminSearchAbleFields } from "./admin.constant";

const getAllAdminFromDB = async (params: any, options: any) => {
  const andConditions: Prisma.AdminWhereInput[] = [];

  const { searchTerm, ...filteredData } = params;
  const { limit, skip } = paginationHelper.calculatePagination(options);

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
          equals: filteredData[key],
        },
      })),
    });
  }

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
  return result;
};

export const AdminService = {
  getAllAdminFromDB,
};
