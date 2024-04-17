import { Router } from "express";
import { DoctorController } from "./doctor.controller";

const router = Router();

router.patch("/:id", DoctorController.doctorUpdate);

export const DoctorRoutes = router;
