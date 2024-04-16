import { Router } from "express";
import { AdminRoute } from "../modules/Admin/admin.routes";
import { AuthRoutes } from "../modules/Auth/auth.routes";

import { SpecialtiesRoutes } from "../modules/Specialties/specialties.routes";
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
  {
    path: "/specialties",
    route: SpecialtiesRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
