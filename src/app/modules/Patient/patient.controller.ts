import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import pick from "../../../shared/pick";
import sendResponse from "../../../shared/sendResponse";
import { patientFilterableFields } from "./patient.constant";
import { PatientService } from "./patient.service";

const getAllPatient = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, patientFilterableFields);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

  const result = await PatientService.getAllPatientFromDB(filters, options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All Patient retrieval successfully",
    meta: result.meta,
    data: result.data,
  });
});

const getSinglePatient = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await PatientService.getSinglePatientFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Patient retrieval successfully",
    data: result,
  });
});

const updatePatient = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await PatientService.updatePatientIntoDB(id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Patient update successfully",
    data: result,
  });
});
const deletePatient = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await PatientService.deletePatientFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Patient delete successfully",
    data: result,
  });
});

const softDeletePatient = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await PatientService.softDeletePatientIntoDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Patient soft delete successfully",
    data: result,
  });
});

export const PatientController = {
  getAllPatient,
  getSinglePatient,
  updatePatient,
  deletePatient,
  softDeletePatient,
};
