import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { DoctorService } from "./doctor.service";

const doctorUpdate = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await DoctorService.doctorUpdateIntoDB(id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "doctor updated successfully",
    data: result,
  });
});

export const DoctorController = {
  doctorUpdate,
};
