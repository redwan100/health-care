import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import pick from "../../../shared/pick";
import sendResponse from "../../../shared/sendResponse";
import { userFilterableFields } from "./user.constant";
import { userService } from "./user.service";

const createAdmin = catchAsync(async (req: Request, res: Response) => {
  try {
    const result = await userService.createAdminIntoDB(req);
    res.status(httpStatus.CREATED).json({
      success: true,
      message: "admin created successfully",
      data: result,
    });
  } catch (err: any) {
    res.status(httpStatus.BAD_REQUEST).json({
      success: false,
      message: err.name || "something went wrong",
      error: err,
    });
  }
});

const createDoctor = catchAsync(async (req: Request, res: Response) => {
  try {
    const result = await userService.createPatientIntoDB(req);
    res.status(httpStatus.CREATED).json({
      success: true,
      message: "doctor created successfully",
      data: result,
    });
  } catch (err: any) {
    res.status(httpStatus.BAD_REQUEST).json({
      success: false,
      message: err.name || "something went wrong",
      error: err,
    });
  }
});

const createPatient = catchAsync(async (req: Request, res: Response) => {
  try {
    const result = await userService.createPatientIntoDB(req);
    res.status(httpStatus.CREATED).json({
      success: true,
      message: "patient created successfully",
      data: result,
    });
  } catch (err: any) {
    res.status(httpStatus.BAD_REQUEST).json({
      success: false,
      message: err.name || "something went wrong",
      error: err,
    });
  }
});

const getAllUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const filteredData = pick(req.query, userFilterableFields);
      const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

      const result = await userService.getAllUserFromDB(filteredData, options);

      sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Successfully retrieved all users",
        meta: result.meta,
        data: result.data,
      });
    } catch (err: any) {
      next(err);
    }
  }
);

export const userController = {
  createAdmin,
  createDoctor,
  createPatient,
  getAllUser,
};
