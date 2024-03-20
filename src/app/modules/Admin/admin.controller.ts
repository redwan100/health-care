import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import pick from "../../../shared/pick";
import sendResponse from "../../../shared/sendResponse";
import { adminFilterableFields } from "./admin.constant";
import { AdminService } from "./admin.service";

const getAllAdmin = async (req: Request, res: Response, next:NextFunction) => {
  try {
    const filteredData = pick(req.query, adminFilterableFields);
    const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

    const result = await AdminService.getAllAdminFromDB(filteredData, options);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Successfully retrieved all admins",
      meta: result.meta,
      data: result.data,
    });
  } catch (err: any) {
   next(err)
  }
};

const getSingleAdmin = async (req: Request, res: Response, next:NextFunction) => {
  try {
    const { adminId } = req.params;
    const result = await AdminService.getSingleAdminFromDB(adminId);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "successfully retrieved admin",
      data: result,
    });
  } catch (err: any) {
    next(err);
  }
};

const updateAdmin = async (req: Request, res: Response, next:NextFunction) => {
  try {
    const { adminId } = req.params;
    const data = req.body;
    const result = await AdminService.updateAdminIntoDB(adminId, data);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "successfully updated admin",
      data: result,
    });
  } catch (err: any) {
  next(err);
  }
};

const deleteAdmin = async (req: Request, res: Response, next:NextFunction) => {
  try {
    const { adminId } = req.params;
    const result = await AdminService.deleteAdminFromDB(adminId);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "successfully deleted admin",
      data: result,
    });
  } catch (err: any) {
   next(err);
  }
};

const softDeleteAdmin = async (req: Request, res: Response, next:NextFunction) => {
  try {
    const { adminId } = req.params;
    const result = await AdminService.softDeleteAdminFromDB(adminId);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "successfully deleted admin",
      data: result,
    });
  } catch (err: any) {
    next(err);
  }
};

export const AdminController = {
  getAllAdmin,
  getSingleAdmin,
  updateAdmin,
  deleteAdmin,
  softDeleteAdmin,
};
