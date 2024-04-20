import { UserRole } from "@prisma/client";
import { Router } from "express";
import auth from "../../middlewares/auth";
import { ScheduleController } from "./schedule.controller";

const router = Router();

router.post(
  "/",

  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  ScheduleController.createSchedule
);

router.get("/", auth(UserRole.DOCTOR), ScheduleController.getSchedule);

export const ScheduleRoutes = router;
