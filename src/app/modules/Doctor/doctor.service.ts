import { Prisma, UserStatus } from "@prisma/client";
import { paginationHelper } from "../../../helpers/paginationHelpar";
import prisma from "../../../shared/prisma";
import { TPaginationOptions } from "../../types/pagination";
import { doctorSearchableFields } from "./doctor.constant";

const getAllDoctorFromDB = async (
  filters: any,
  options: TPaginationOptions
) => {
  const { limit, page, skip } = paginationHelper.calculatePagination(options);

  const { searchTerm, specialties, ...filterData } = filters;

  const andConditions: Prisma.DoctorWhereInput[] = [];

  if (searchTerm) {
    andConditions.push({
      OR: doctorSearchableFields.map((key) => ({
        [key]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (specialties && specialties.length > 0) {
    andConditions.push({
      doctorSpecialties: {
        some: {
          specialties: {
            title: {
              contains: specialties,
              mode: "insensitive",
            },
          },
        },
      },
    });
  }

  if (Object.keys(filterData).length > 0) {
    const filterCondition = Object.keys(filterData).map((key) => ({
      [key]: {
        equals: (filterData as any)[key],
      },
    }));
    andConditions.push(...filterCondition);
  }

  andConditions.push({
    isDeleted: false,
  });

  const whereConditions: Prisma.DoctorWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.doctor.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : { averageRating: "desc" },
    include: {
      doctorSpecialties: {
        include: {
          specialties: true,
        },
      },
    },
  });

  const total = await prisma.doctor.count({
    where: whereConditions,
  });

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

const getSingleDoctorFromDB = async (id: string) => {
  const result = await prisma.doctor.findUniqueOrThrow({
    where: { id, isDeleted: false },
    include: {
      doctorSpecialties: {
        include: {
          specialties: true,
        },
      },
    },
  });
  return result;
};

const doctorUpdateIntoDB = async (id: string, payload: any) => {
  const { specialties, ...doctorInfo } = payload;
  const doctorData = await prisma.doctor.findUniqueOrThrow({
    where: { id },
  });

  await prisma.$transaction(async (transactionClient) => {
    const updatedDoctor = await transactionClient.doctor.update({
      where: { id },
      data: doctorInfo,
    });

    if (specialties && specialties.length > 0) {
      // delete specialty information
      const deletedSpecialties = specialties.filter(
        (specialty) => specialty.isDeleted
      );

      await transactionClient.doctorSpecialties.deleteMany({
        where: {
          doctorId: doctorInfo.id,
          specialtiesId: deletedSpecialties.specialtiesId,
        },
      });

      // create specialty information
      const createdSpecialties = specialties.filter(
        (specialty) => !specialty.isDeleted
      );
      for (const specialty of createdSpecialties) {
        await transactionClient.doctorSpecialties.create({
          data: {
            doctorId: doctorData.id,
            specialtiesId: specialty.specialtiesId,
          },
        });
      }
    }
  });

  const result = await prisma.doctor.findUnique({
    where: { id },
    include: {
      doctorSpecialties: {
        include: {
          specialties: true,
        },
      },
    },
  });

  return result;
};

const deleteDoctorFromDB = async (id: string) => {
  await prisma.doctor.findUniqueOrThrow({
    where: { id, isDeleted: false },
  });

  const result = await prisma.$transaction(async (transactionClient) => {
    const doctorDeletedData = await transactionClient.doctor.delete({
      where: { id },
    });

    await transactionClient.user.delete({
      where: {
        email: doctorDeletedData.email,
      },
    });

    return doctorDeletedData;
  });

  return result;
};

const softDeleteDoctorFromDB = async (id: string) => {
  return await prisma.$transaction(async (transactionClient) => {
    const deletedDoctor = await transactionClient.doctor.update({
      where: { id },
      data: {
        isDeleted: true,
      },
    });

    await transactionClient.user.update({
      where: {
        email: deletedDoctor.email,
      },
      data: {
        status: UserStatus.DELETED,
      },
    });

    return deletedDoctor;
  });
};

export const DoctorService = {
  getAllDoctorFromDB,
  getSingleDoctorFromDB,
  doctorUpdateIntoDB,
  deleteDoctorFromDB,
  softDeleteDoctorFromDB,
};
