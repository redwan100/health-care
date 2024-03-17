import { Request, Response } from "express";
import httpStatus from "http-status";
import { AdminService } from "./admin.service";

const getAllAdmin = async (req: Request, res: Response) => {
  try {
    const result = await AdminService.getAllAdminFromDB(req.query);
    res.status(httpStatus.OK).json({
      success: true,
      message: "successfully retrieved all admins",
      data: result,
    });
  } catch (err: any) {
    res.status(httpStatus.BAD_REQUEST).json({
      success: false,
      message: err.name || "something went wrong",
    });
  }
};

export const AdminController = {
  getAllAdmin,
};
