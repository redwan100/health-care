import { Patient, Prisma, UserStatus } from "@prisma/client";
import { paginationHelper } from "../../../helpers/paginationHelpar";
import prisma from "../../../shared/prisma";
import { TPaginationOptions } from "../../types/pagination";
import { patientSearchableFields } from "./patient.constant";
import { TUpdatePatient } from "./patient.types";

const getAllPatientFromDB = async (
  filters: any,
  options: TPaginationOptions
) => {
  const { limit, page, skip } = paginationHelper.calculatePagination(options);
  const { searchTerm, ...filterData } = filters;

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: patientSearchableFields.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => {
        return {
          [key]: {
            equals: (filterData as any)[key],
          },
        };
      }),
    });
  }
  andConditions.push({
    isDeleted: false,
  });

  const whereConditions: Prisma.PatientWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.patient.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : {
            createdAt: "desc",
          },
    include: {
      medicalReport: true,
      patientHealthData: true,
    },
  });
  const total = await prisma.patient.count({
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

const getSinglePatientFromDB = async (id: string) => {
  const result = await prisma.patient.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
    },
  });

  return result;
};

const updatePatientIntoDB = async (
  id: string,
  payload: Partial<TUpdatePatient>
): Promise<Patient | null> => {
  const { patientHealthData, medicalReport, ...patientData } = payload;

  const patientInfo = await prisma.patient.findUniqueOrThrow({
    where: { id, isDeleted: false },
  });

  await prisma.$transaction(async (transactionClient) => {
    // * update patient data
    await transactionClient.patient.update({
      where: { id },
      data: patientData,
      include: {
        patientHealthData: true,
        medicalReport: true,
      },
    });

    // * create or update health data
    if (patientHealthData) {
      await transactionClient.patientHealthData.upsert({
        where: {
          patientId: patientInfo.id,
        },
        update: patientHealthData,
        create: {
          patientId: patientInfo.id,
          ...patientHealthData,
        },
      });
    }
    //  * create medical report
    if (medicalReport) {
      await transactionClient.medicalReport.create({
        data: {
          patientId: patientInfo.id,
          ...medicalReport,
        },
      });
    }
  });

  const sendResponse = await prisma.patient.findUniqueOrThrow({
    where: {
      id: patientInfo.id,
    },
    include: {
      patientHealthData: true,
      medicalReport: true,
    },
  });

  return sendResponse;
};

const deletePatientFromDB = async (id: string): Promise<Patient | null> => {
  const result = await prisma.$transaction(async (transactionClient) => {
    // delete medical report
    await transactionClient.medicalReport.deleteMany({
      where: {
        patientId: id,
      },
    });

    // delete patient health data
    await transactionClient.patientHealthData.delete({
      where: {
        patientId: id,
      },
    });

    // delete patient
    const deletedPatient = await transactionClient.patient.delete({
      where: { id },
    });

    // delete user
    await transactionClient.user.delete({
      where: {
        email: deletedPatient.email,
      },
    });

    return deletedPatient;
  });

  return result;
};

const softDeletePatientIntoDB = async (id: string): Promise<Patient | null> => {
  const result = await prisma.$transaction(async (transactionClient) => {
    const deletedPatient = await transactionClient.patient.update({
      where: { id },
      data: {
        isDeleted: true,
      },
    });

    await transactionClient.user.update({
      where: {
        email: deletedPatient.email,
      },
      data: {
        status: UserStatus.DELETED,
      },
    });

    return deletedPatient;
  });

  return result;
};
export const PatientService = {
  getAllPatientFromDB,
  getSinglePatientFromDB,
  updatePatientIntoDB,
  deletePatientFromDB,
  softDeletePatientIntoDB,
};
