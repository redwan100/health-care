import { UserRole } from "@prisma/client";
import { NextFunction, Request, Response, Router } from "express";
import auth from "../../middlewares/auth";
import { fileUploader } from "./../../../helpers/fileUploader";
import { userController } from "./user.controller";
import { UserValidation } from "./user.validation";

const router = Router();

router.post(
  "/create-admin",

  fileUploader.upload.single("file"),

  (req: Request, res: Response, next: NextFunction) => {
    const data = UserValidation.createAdminValidationSchema.parse(
      JSON.parse(req.body.data)
    );

    req.body = data;
    next();
  },

  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  userController.createAdmin
);

export const userRoute = router;
