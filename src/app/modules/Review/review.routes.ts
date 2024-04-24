import { UserRole } from "@prisma/client";
import { Router } from "express";
import auth from "../../middlewares/auth";
import { ReviewController } from "./review.controller";

const router = Router();

router.post("/", auth(UserRole.PATIENT), ReviewController.createReview);

router.get(
  "/",

  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  ReviewController.getAllReview
);

export const ReviewRoutes = router;
