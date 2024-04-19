import { Router } from "express";
import { PatientController } from "./patient.controller";

const router = Router();

router.get("/", PatientController.getAllPatient);
router.get("/:id", PatientController.getSinglePatient);
router.patch("/:id", PatientController.updatePatient);

export const PatientRoutes = router;
