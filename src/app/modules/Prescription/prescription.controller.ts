import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import pick from "../../../shared/pick";
import sendResponse from "../../../shared/sendResponse";
import { TAuthUser } from "../../../types/common";
import { PrescriptionService } from "./prescription.service";
import { prescriptionFilterableFields } from "./prescription.constant";

const createPrescription = catchAsync(
  async (req: Request & { user?: TAuthUser }, res: Response) => {
    const user = req.user;
    const result = await PrescriptionService.createPrescriptionIntoDB(
      user as TAuthUser,
      req.body
    );

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "prescription created successfully",
      data: result,
    });
  }
);
const getMyPrescription = catchAsync(
  async (req: Request & { user?: TAuthUser }, res: Response) => {
    const user = req.user;
    const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
    const result = await PrescriptionService.getMyPrescriptionFromDB(
      user as TAuthUser,
      options
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "prescription retrieved successfully",
      meta: result.meta,
      data: result.data,
    });
  }
);



const getAllPrescription = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, prescriptionFilterableFields);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
  const result = await PrescriptionService.getAllPrescriptionFromDB(filters, options);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Prescriptions retrieval successfully",
    meta: result.meta,
    data: result.data,
  });
});

export const PrescriptionController = {
  createPrescription,
  getMyPrescription,
  getAllPrescription,
};
