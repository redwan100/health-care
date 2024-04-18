import { UserRole } from "@prisma/client";
import { NextFunction, Request, Response, Router } from "express";
import auth from "../../middlewares/auth";
import { fileUploader } from "./../../../helpers/fileUploader";
import { userController } from "./user.controller";
import { UserValidation } from "./user.validation";

const router = Router();

router.get(
  "/",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  userController.getAllUser
);

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

router.post(
  "/create-doctor",

  fileUploader.upload.single("file"),

  (req: Request, res: Response, next: NextFunction) => {
   
    const data = UserValidation.createDoctorValidationSchema.parse(
      JSON.parse(req.body.data)
    );

    req.body = data;
    next();
  },

  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  userController.createDoctor
);

router.post(
  "/create-patient",

  fileUploader.upload.single("file"),

  (req: Request, res: Response, next: NextFunction) => {
    const data = UserValidation.createPatientValidationSchema.parse(
      JSON.parse(req.body.data)
    );

    req.body = data;
    next();
  },

  userController.createPatient
);

router.patch(
  "/:id/status",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  userController.changeProfileStatus
);
router.get(
  "/me",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT),
  userController.getMyProfile
);

router.patch(
  "/update-my-profile",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT),
  fileUploader.upload.single("file"),

  (req: Request, res: Response, next: NextFunction) => {
    const data = JSON.parse(req.body.data);

    req.body = data;
    next();
  },

  userController.updateMyProfile
);

export const userRoute = router;
