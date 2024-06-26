import { UserRole } from "@prisma/client";
import { Router } from "express";
import auth from "../../middlewares/auth";
import { PrescriptionController } from "./prescription.controller";

const router = Router();

router.get(
  "/",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  PrescriptionController.getAllPrescription
);

router.post(
  "/",

  auth(UserRole.DOCTOR),
  PrescriptionController.createPrescription
);

router.get(
  "/my-prescription",

  auth(UserRole.PATIENT),
  PrescriptionController.getMyPrescription
);

export const PrescriptionRoutes = router;
