import { Router } from "express";
import { DoctorController } from "./doctor.controller";

const router = Router();

router.get("/", DoctorController.getAllDoctor);
router.get("/:id", DoctorController.getSingleDoctor);
router.patch("/:id", DoctorController.updateDoctor);
router.delete("/:id", DoctorController.deleteDoctor);
router.delete("/soft/:id", DoctorController.softDeleteDoctor);

export const DoctorRoutes = router;
