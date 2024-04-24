import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { TAuthUser } from "./../../../types/common";
import { metaService } from "./meta.service";

const getMetadata = catchAsync(
  async (req: Request & { user?: TAuthUser }, res: Response) => {
    const user = req.user;
    const result = await metaService.getMetadataFromDB(user as TAuthUser);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "metadata retrieved successfully",
      data: result,
    });
  }
);

export const metaController = {
  getMetadata,
};
