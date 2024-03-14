import { RequestHandler } from "express";
import httpStatus from "http-status";
import { userService } from "./user.service";

const createAdmin: RequestHandler = async (req, res) => {
  
  const result = await userService.createAdminIntoDB(req.body);
  res.status(httpStatus.CREATED).json({
    success: true,
    message: "admin created successfully",
    data: result,
  });
};

export const userController = {
  createAdmin,
};
