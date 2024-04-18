import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { DoctorService } from "./doctor.service";
import pick from "../../../shared/pick";
import { doctorFilterableFields } from "./doctor.constant";

const getAllDoctor = catchAsync(async (req: Request, res: Response) => {


  const filters = pick(req.query,doctorFilterableFields);
  const options = pick(req.query,["limit","page",'sortBy','sortOrder'])

  const result = await DoctorService.getAllDoctorFromDB(filters,options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "all doctor retrieved successful",
    data: result,
  });
});
const getSingleDoctor = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await DoctorService.getSingleDoctorFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "doctor retrieved successful",
    data: result,
  });
});
const updateDoctor = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await DoctorService.doctorUpdateIntoDB(id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "doctor updated successfully",
    data: result,
  });
});

const deleteDoctor = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await DoctorService.deleteDoctorFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "doctor deleted successfully",
    data: result,
  });
});

const softDeleteDoctor = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await DoctorService.softDeleteDoctorFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "doctor soft deleted successfully",
    data: result,
  });
});

export const DoctorController = {
  getAllDoctor,
  getSingleDoctor,
  updateDoctor,
  deleteDoctor,
  softDeleteDoctor,
};
