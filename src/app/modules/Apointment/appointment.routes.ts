import { UserRole } from "@prisma/client";
import { Router } from "express";
import auth from "../../middlewares/auth";
import { AppointmentController } from "./appointment.controller";

const router = Router();

router.get(
  "/my-appointment",
  auth(UserRole.PATIENT, UserRole.DOCTOR),
  AppointmentController.getMyAppointment
);

router.post(
  "/",
  auth(UserRole.PATIENT),
  AppointmentController.createAppointment
);
router.get(
  "/",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  AppointmentController.getAllAppointment
);

router.patch(
  "/status/:id",

  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.DOCTOR),
  AppointmentController.changeAppointmentStatus
);

export const AppointmentRoutes = router;
