import { Router } from "express";
import { AdminController } from "./admin.controller";

const router = Router();

router.get("/", AdminController.getAllAdmin);
router.get("/:adminId", AdminController.getSingleAdmin);
router.patch("/:adminId", AdminController.updateAdmin);

export const AdminRoute = router;
