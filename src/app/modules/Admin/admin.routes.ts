import { UserRole } from "@prisma/client";
import { Router } from "express";
import validateRequest from "../../../shared/validateRequest";
import auth from "../../middlewares/auth";
import { AdminController } from "./admin.controller";
import { AdminValidation } from "./admin.validation";

const router = Router();

router.get(
  "/",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  AdminController.getAllAdmin
);
router.get(
  "/:adminId",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  AdminController.getSingleAdmin
);
router.patch(
  "/:adminId",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  validateRequest(AdminValidation.updateValidationSchema),
  AdminController.updateAdmin
);
router.delete(
  "/:adminId",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  AdminController.deleteAdmin
);
router.delete(
  "/soft/:adminId",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  AdminController.softDeleteAdmin
);

export const AdminRoute = router;
