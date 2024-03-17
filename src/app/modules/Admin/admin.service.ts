import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const getAllAdminFromDB = async (params: any) => {
  const andConditions: Prisma.AdminWhereInput[] = [];

  const adminSearchAbleField = ["name", "email"];
  if (params.searchTerm) {
    andConditions.push({
      OR: adminSearchAbleField.map((field) => ({
        [field]: {
          contains: params.searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  const whereCondition: Prisma.AdminWhereInput = { AND: andConditions };

  const result = await prisma.admin.findMany({
    where: whereCondition,
  });
  return result;
};

export const AdminService = {
  getAllAdminFromDB,
};
