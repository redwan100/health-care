import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { PaymentService } from "./payment.service";

const initPayment = catchAsync(async (req: Request, res: Response) => {
  const { appointmentId } = req.params;

  const result = await PaymentService.initPayment(appointmentId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "payment initiate successful",
    data: result,
  });
});

const validPayment = catchAsync(async (req: Request, res: Response) => {
  const result = await PaymentService.validPayment(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "payment validated successful",
    data: result,
  });
});

export const PaymentController = {
  initPayment,
  validPayment,
};
