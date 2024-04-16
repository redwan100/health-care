import { NextFunction, Request, Response, Router } from "express";
import { fileUploader } from "../../../helpers/fileUploader";
import { SpecialtiesController } from "./specialties.controller";
import { SpecialtiesValidationSchema } from "./specialties.validation";

const router = Router();

router.post(
  "/",

  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    const data = SpecialtiesValidationSchema.create.parse(
      JSON.parse(req.body.data)
    );

    req.body = data;
    return SpecialtiesController.createSpecialties(req, res, next);
  }
);

router.get("/", SpecialtiesController.getSpecialties);
router.delete("/:id", SpecialtiesController.deleteSpecialties);

export const SpecialtiesRoutes = router;
