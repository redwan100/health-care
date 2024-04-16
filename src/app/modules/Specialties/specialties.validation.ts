import { z } from "zod";

const create = z.object({
  title: z.string({
    invalid_type_error: "title must be string",
    required_error: "title is required",
  }),
});

export const SpecialtiesValidationSchema = {
  create,
};
