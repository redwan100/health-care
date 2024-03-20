import { Router } from "express";
import { AdminRoute } from "../modules/Admin/admin.routes";
import { userRoute } from "../modules/User/user.routes";

const router = Router();

const moduleRoutes = [
  {
    path: "/user",
    route: userRoute,
  },
  {
    path: "/admin",
    route: AdminRoute,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
