import { Prisma, Schedule } from "@prisma/client";
import { addHours, addMinutes, format } from "date-fns";
import { paginationHelper } from "../../../helpers/paginationHelpar";
import prisma from "../../../shared/prisma";
import { TAuthUser } from "../../../types/common";
import { TPaginationOptions } from "../../types/pagination";
import { TFilterRequest, TSchedule } from "./schedule.types";

const convertDateTime = (date: Date) => {
  const offset = date.getTimezoneOffset() * 60000;

  return new Date(date.getTime() + offset);
};

const createScheduleIntoDB = async (
  payload: TSchedule
): Promise<Schedule[]> => {
  const { startDate, endDate, startTime, endTime } = payload;

  const intervalTime = 30;

  const schedules = [];

  const currentDate = new Date(startDate); // start date
  const lastDate = new Date(endDate); // end date

  while (currentDate <= lastDate) {
    // 09:30  ---> ['09', '30']
    const startDateTime = new Date(
      addMinutes(
        addHours(
          `${format(currentDate, "yyyy-MM-dd")}`,
          Number(startTime.split(":")[0])
        ),
        Number(startTime.split(":")[1])
      )
    );

    const endDateTime = new Date(
      addMinutes(
        addHours(
          `${format(currentDate, "yyyy-MM-dd")}`,
          Number(endTime.split(":")[0])
        ),
        Number(endTime.split(":")[1])
      )
    );

    while (startDateTime < endDateTime) {
      // const scheduleData = {
      //     startDateTime: startDateTime,
      //     endDateTime: addMinutes(startDateTime, interverlTime)
      // }

      const s = await convertDateTime(startDateTime);
      const e = await convertDateTime(addMinutes(startDateTime, intervalTime));

      const scheduleData = {
        startDateTime: s,
        endDateTime: e,
      };

      const existingSchedule = await prisma.schedule.findFirst({
        where: {
          startDateTime: scheduleData.startDateTime,
          endDateTime: scheduleData.endDateTime,
        },
      });

      if (!existingSchedule) {
        const result = await prisma.schedule.create({
          data: scheduleData,
        });
        schedules.push(result);
      }

      startDateTime.setMinutes(startDateTime.getMinutes() + intervalTime);
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return schedules;
};

const getAllScheduleFromDB = async (
  filters: TFilterRequest,
  options: TPaginationOptions,
  user: TAuthUser
) => {
  const { limit, page, skip } = paginationHelper.calculatePagination(options);
  const { startDate, endDate, ...filterData } = filters;

  const andConditions = [];

  if (startDate && endDate) {
    andConditions.push({
      AND: [
        {
          startDateTime: {
            gte: startDate,
          },
        },
        {
          endDateTime: {
            lte: endDate,
          },
        },
      ],
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

  const whereConditions: Prisma.ScheduleWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const doctorSchedules = await prisma.doctorSchedules.findMany({
    where: {
      doctor: {
        email: user?.email,
      },
    },
  });

  const doctorScheduleIds = doctorSchedules.map(
    (schedule) => schedule.scheduleId
  );

  const result = await prisma.schedule.findMany({
    where: {
      ...whereConditions,
      id: {
        notIn: doctorScheduleIds,
      },
    },
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : {
            createdAt: "desc",
          },
  });
  const total = await prisma.schedule.count({
    where: {
      ...whereConditions,
      id: {
        notIn: doctorScheduleIds,
      },
    },
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

const getSingleScheduleFromDB = async (id: string) => {
  const result = await prisma.schedule.findUniqueOrThrow({
    where: { id },
  });

  return result;
};
const deletedScheduleFromDB = async (id: string) => {
  const result = await prisma.schedule.delete({
    where: { id },
  });

  return result;
};

export const ScheduleService = {
  createScheduleIntoDB,
  getAllScheduleFromDB,
  getSingleScheduleFromDB,
  deletedScheduleFromDB,
};
