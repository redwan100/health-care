import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { AuthService } from "./auth.service";

const loginUser = catchAsync(async (req, res) => {
  console.log(req.body);
  const result = await AuthService.loginUserIntoDB();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Login successful",
    data: result,
  });
});

export const AuthController = {
  loginUser,
};
