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
