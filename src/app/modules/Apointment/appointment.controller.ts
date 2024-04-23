import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import pick from "../../../shared/pick";
import sendResponse from "../../../shared/sendResponse";
import { TAuthUser } from "../../../types/common";
import { appointmentFilterableFields } from "./appointment.constant";
import { AppointmentService } from "./appointment.service";

const createAppointment = catchAsync(
  async (req: Request & { user?: TAuthUser }, res: Response) => {
    const user = req.user;
    const result = await AppointmentService.createAppointmentIntoDB(
      user as TAuthUser,
      req.body
    );
    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "appointment created successful",
      data: result,
    });
  }
);
const getMyAppointment = catchAsync(
  async (req: Request & { user?: TAuthUser }, res: Response) => {
    const user = req.user;
    const filters = pick(req.query, ["status", "paymentStatus"]);
    const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);

    const result = await AppointmentService.getMyAppointmentFromDB(
      user as TAuthUser,
      filters,
      options
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "my appointment retrieved successful",
      data: result,
    });
  }
);

const getAllAppointment = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, appointmentFilterableFields);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
  const result = await AppointmentService.getAllAppointmentFromDB(
    filters,
    options
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Appointment retrieval successfully",
    meta: result.meta,
    data: result.data,
  });
});

const changeAppointmentStatus = catchAsync(
  async (req: Request & {user?:TAuthUser}, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;
    const user = req.user;
    const result = await AppointmentService.changeAppointmentStatus(id, status, user as TAuthUser);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Appointment status changed successfully",
      data: result,
    });
  }
);
export const AppointmentController = {
  createAppointment,
  getMyAppointment,
  getAllAppointment,
  changeAppointmentStatus,
};
