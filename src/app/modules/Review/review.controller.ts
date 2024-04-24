import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import pick from "../../../shared/pick";
import sendResponse from "../../../shared/sendResponse";
import { TAuthUser } from "../../../types/common";
import { reviewFilterableFields } from "./review.constant";
import { ReviewService } from "./review.service";

const createReview = catchAsync(
  async (req: Request & { user?: TAuthUser }, res: Response) => {
    const user = req.user;

    const result = await ReviewService.createReviewIntoDB(
      user as TAuthUser,
      req.body
    );

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "review created successfully",
      data: result,
    });
  }
);

const getAllReview = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, reviewFilterableFields);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
  const result = await ReviewService.getAllReviewFromDB(filters, options);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Reviews retrieval successfully",
    meta: result.meta,
    data: result.data,
  });
});

export const ReviewController = {
  createReview,
  getAllReview,
};
