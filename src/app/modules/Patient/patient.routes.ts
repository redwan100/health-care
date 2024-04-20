import { Router } from "express";
import { PatientController } from "./patient.controller";

const router = Router();

router.get("/", PatientController.getAllPatient);
router.get("/:id", PatientController.getSinglePatient);
router.patch("/:id", PatientController.updatePatient);
router.delete("/:id", PatientController.deletePatient);
router.delete("/soft/:id", PatientController.softDeletePatient);

export const PatientRoutes = router;
