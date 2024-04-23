import {
  AppointmentStatus,
  Prisma,
  UserRole,
  paymentStatus,
} from "@prisma/client";
import httpStatus from "http-status";
import { v4 as uuidv4 } from "uuid";
import { paginationHelper } from "../../../helpers/paginationHelpar";
import prisma from "../../../shared/prisma";
import { TAuthUser } from "../../../types/common";
import ApiError from "../../errors/ApiError";
import { TPaginationOptions } from "../../types/pagination";

const createAppointmentIntoDB = async (user: TAuthUser, payload: any) => {
  const patientInfo = await prisma.patient.findUniqueOrThrow({
    where: {
      email: user?.email,
    },
  });

  const doctorInfo = await prisma.doctor.findUniqueOrThrow({
    where: {
      id: payload.doctorId,
      isDeleted: false,
    },
  });

  const scheduleData = await prisma.doctorSchedules.findFirstOrThrow({
    where: {
      doctorId: doctorInfo.id,
      scheduleId: payload.scheduleId,
      isBooked: false,
    },
  });

  const videoCallingId = uuidv4();

  const result = await prisma.$transaction(async (transactionClient) => {
    const appointmentData = await transactionClient.appointment.create({
      data: {
        patientId: patientInfo.id,
        doctorId: doctorInfo.id,
        scheduleId: payload.scheduleId,
        videoCallingId,
      },
      include: {
        patient: true,
        doctor: true,
        schedule: true,
      },
    });

    await transactionClient.doctorSchedules.update({
      where: {
        doctorId_scheduleId: {
          doctorId: doctorInfo.id,
          scheduleId: payload.scheduleId,
        },
      },
      data: {
        isBooked: true,
        appointmentId: appointmentData.id,
      },
    });

    const today = new Date();
    const transactionId = `healthcare-${today.getFullYear()}-${today.getMonth()}-${today.getDate()}-${today.getHours()}-${today.getMinutes()}-${today.getSeconds()}`;

    await transactionClient.payment.create({
      data: {
        appointmentId: appointmentData.id,
        amount: doctorInfo.appointmentFee,
        transactionId,
      },
    });

    return appointmentData;
  });

  return result;
};

const getMyAppointmentFromDB = async (
  user: TAuthUser,
  filters: any,
  options: TPaginationOptions
) => {
  const { page, limit, skip } = paginationHelper.calculatePagination(options);
  const { ...filterData } = filters;

  const andConditions: Prisma.AppointmentWhereInput[] = [];

  if (user.role === UserRole.PATIENT) {
    andConditions.push({
      patient: {
        email: user?.email,
      },
    });
  } else if (user.role === UserRole.DOCTOR) {
    andConditions.push({
      doctor: {
        email: user?.email,
      },
    });
  }

  if (Object.keys(filterData).length > 0) {
    const filterConditions = Object.keys(filterData).map((key) => ({
      [key]: {
        equals: (filterData as any)[key],
      },
    }));

    andConditions.push(...filterConditions);
  }

  const whereConditions: Prisma.AppointmentWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.appointment.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : { createdAt: "desc" },
    include:
      user.role === UserRole.PATIENT
        ? {
            doctor: true,
            schedule: true,
          }
        : {
            patient: {
              include: {
                patientHealthData: true,
                medicalReport: true,
              },
            },
            schedule: true,
          },
  });

  const total = await prisma.appointment.count({
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

const getAllAppointmentFromDB = async (
  filters: any,
  options: TPaginationOptions
) => {
  const { limit, page, skip } = paginationHelper.calculatePagination(options);
  const { patientEmail, doctorEmail, ...filterData } = filters;
  const andConditions = [];

  if (patientEmail) {
    andConditions.push({
      patient: {
        email: patientEmail,
      },
    });
  } else if (doctorEmail) {
    andConditions.push({
      doctor: {
        email: doctorEmail,
      },
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

  // console.dir(andConditions, { depth: Infinity })
  const whereConditions: Prisma.AppointmentWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.appointment.findMany({
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
      doctor: true,
      patient: true,
    },
  });
  const total = await prisma.appointment.count({
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

const changeAppointmentStatus = async (
  appointmentId: string,
  status: AppointmentStatus,
  user: TAuthUser
) => {
  const appointmentData = await prisma.appointment.findUniqueOrThrow({
    where: {
      id: appointmentId,
    },
    include: {
      doctor: true,
    },
  });

  if (user.role === UserRole.DOCTOR) {
    if (!(user.email === appointmentData.doctor.email)) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "this is not your appointment"
      );
    }
  }

  const result = await prisma.appointment.update({
    where: {
      id: appointmentId,
    },
    data: {
      status,
    },
  });

  return result;
};

const cancelUnpaidAppointments = async () => {
  const thirtyMinuteAgo = new Date(Date.now() - 30 * 60 * 1000);

  const unPaidAppointments = await prisma.appointment.findMany({
    where: {
      paymentStatus: paymentStatus.UNPAID,
      createdAt: {
        lte: thirtyMinuteAgo,
      },
    },
  });

  const unPaidAppointmentIds = unPaidAppointments.map((data) => data.id);

  await prisma.$transaction(async (tx) => {
    await tx.payment.deleteMany({
      where: {
        appointmentId: {
          in: unPaidAppointmentIds,
        },
      },
    });

    await tx.appointment.deleteMany({
      where: {
        id: {
          in: unPaidAppointmentIds,
        },
      },
    });

    for (const unPaidAppointment of unPaidAppointments) {
      await tx.doctorSchedules.updateMany({
        where: {
          scheduleId: unPaidAppointment.scheduleId,
          doctorId: unPaidAppointment.doctorId,
        },
        data: {
          isBooked: false,
        },
      });
    }
  });
};

export const AppointmentService = {
  createAppointmentIntoDB,
  getMyAppointmentFromDB,
  getAllAppointmentFromDB,
  changeAppointmentStatus,
  cancelUnpaidAppointments,
};
