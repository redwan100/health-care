import { Router } from "express";
import { AdminController } from "./admin.controller";

const router = Router();

router.get("/", AdminController.getAllAdmin);
router.get("/:adminId", AdminController.getSingleAdmin);

export const AdminRoute = router;
