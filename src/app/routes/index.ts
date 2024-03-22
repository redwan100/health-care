import { Router } from "express";
import { AdminRoute } from "../modules/Admin/admin.routes";
import { AuthRoutes } from "../modules/Auth/auth.routes";
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
  {
    path: "/auth",
    route: AuthRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
