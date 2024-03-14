import { Router } from "express";
import { userController } from "./user.controller";

const router = Router();

router.post("/", userController.createAdmin);

export const userRoute = router;
