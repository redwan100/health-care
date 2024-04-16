import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { SpecialtiesService } from "./specialties.service";

const createSpecialties = catchAsync(async (req: Request, res: Response) => {
  const result = await SpecialtiesService.createSpecialtiesIntoDB(req);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "specialties created successfully",
    data: result,
  });
});
const getSpecialties = catchAsync(async (req: Request, res: Response) => {
  const result = await SpecialtiesService.getSpecialtiesFromDB();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "specialties retrieved successful",
    data: result,
  });
});
const deleteSpecialties = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await SpecialtiesService.deleteSpecialtiesFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "specialties deleted successfully",
    data: result,
  });
});

export const SpecialtiesController = {
  createSpecialties,
  getSpecialties,
  deleteSpecialties,
};
