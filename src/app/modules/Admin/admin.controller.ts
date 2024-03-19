import { Request, Response } from "express";
import httpStatus from "http-status";
import pick from "../../../shared/pick";
import { adminFilterableFields } from "./admin.constant";
import { AdminService } from "./admin.service";

const getAllAdmin = async (req: Request, res: Response) => {
  try {
    const filteredData = pick(req.query, adminFilterableFields);
    const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

    const result = await AdminService.getAllAdminFromDB(filteredData, options);

    res.status(httpStatus.OK).json({
      success: true,
      message: "successfully retrieved all admins",
      meta: result.meta,
      data: result.data,
    });
  } catch (err: any) {
    res.status(httpStatus.BAD_REQUEST).json({
      success: false,
      message: err?.name || "something went wrong",
      error: err,
    });
  }
};

const getSingleAdmin = async (req: Request, res: Response) => {
  try {
    const { adminId } = req.params;
    const result = await AdminService.getSingleAdminFromDB(adminId);

    res.status(httpStatus.OK).json({
      success: true,
      message: "successfully retrieved admin",
      data: result,
    });
  } catch (err: any) {
    res.status(httpStatus.BAD_REQUEST).json({
      success: false,
      message: err?.name || "something went wrong",
      error: err,
    });
  }
};

const updateAdmin = async (req: Request, res: Response) => {
  try {
    const { adminId } = req.params;
    const data = req.body;
    const result = await AdminService.updateAdminIntoDB(adminId, data);

    res.status(httpStatus.OK).json({
      success: true,
      message: "successfully updated admin",
      data: result,
    });
  } catch (err: any) {
    res.status(httpStatus.BAD_REQUEST).json({
      success: false,
      message: err?.name || "something went wrong",
      error: err,
    });
  }
};

const deleteAdmin = async (req: Request, res: Response) => {
  try {
    const { adminId } = req.params;
    const result = await AdminService.deleteAdminFromDB(adminId);

    res.status(httpStatus.OK).json({
      success: true,
      message: "successfully deleted admin",
      data: result,
    });
  } catch (err: any) {
    res.status(httpStatus.BAD_REQUEST).json({
      success: false,
      message: err?.name || "something went wrong",
      error: err,
    });
  }
};

const softDeleteAdmin = async (req: Request, res: Response) => {
  try {
    const { adminId } = req.params;
    const result = await AdminService.softDeleteAdminFromDB(adminId);

    res.status(httpStatus.OK).json({
      success: true,
      message: "successfully deleted admin",
      data: result,
    });
  } catch (err: any) {
    res.status(httpStatus.BAD_REQUEST).json({
      success: false,
      message: err?.name || "something went wrong",
      error: err,
    });
  }
};

export const AdminController = {
  getAllAdmin,
  getSingleAdmin,
  updateAdmin,
  deleteAdmin,
  softDeleteAdmin,
};
