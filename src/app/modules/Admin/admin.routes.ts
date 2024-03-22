import { Router } from "express";
import validateRequest from "../../../shared/validateRequest";
import { AdminController } from "./admin.controller";
import { AdminValidation } from "./admin.validation";

const router = Router();

router.get("/", AdminController.getAllAdmin);
router.get("/:adminId", AdminController.getSingleAdmin);
router.patch(
  "/:adminId",
  validateRequest(AdminValidation.updateValidationSchema),
  AdminController.updateAdmin
);
router.delete("/:adminId", AdminController.deleteAdmin);
router.delete("/soft/:adminId", AdminController.softDeleteAdmin);

export const AdminRoute = router;
