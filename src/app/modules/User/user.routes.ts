import { UserRole } from "@prisma/client";
import { Router } from "express";
import auth from "../../middlewares/auth";
import { fileUploader } from "./../../../helpers/fileUploader";
import { userController } from "./user.controller";

const router = Router();



router.post(
  "/",

  fileUploader.upload.single("file"),

  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  userController.createAdmin
);

export const userRoute = router;
