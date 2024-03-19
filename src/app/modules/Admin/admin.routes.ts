import { Router } from "express";
import { AdminController } from "./admin.controller";

const router = Router();

router.get("/", AdminController.getAllAdmin);
router.get("/:adminId", AdminController.getSingleAdmin);
router.patch("/:adminId", AdminController.updateAdmin);
router.delete("/:adminId", AdminController.deleteAdmin);
router.delete("/soft/:adminId", AdminController.softDeleteAdmin);

export const AdminRoute = router;
