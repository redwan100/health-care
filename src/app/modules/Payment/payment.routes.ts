import { Router } from "express";
import { PaymentController } from "./payment.controller";

const router = Router();

router.post("/init-payment/:appointmentId", PaymentController.initPayment);

router.get("/ipn", PaymentController.validPayment);

export const PaymentRoutes = router;
