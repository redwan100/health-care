import { RequestHandler } from "express";
import httpStatus from "http-status";
import { userService } from "./user.service";

const createAdmin: RequestHandler = async (req, res) => {
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
};

export const userController = {
  createAdmin,
};
