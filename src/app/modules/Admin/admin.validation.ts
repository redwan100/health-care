import { z } from "zod";

const updateValidationSchema = z.object({
  body: z.object({
    name: z
      .string({
        invalid_type_error: "name must be string",
      })
      .optional(),
    email: z
      .string({
        invalid_type_error: "email must be string",
      })
      .optional(),
  }),
});

export const AdminValidation = {
  updateValidationSchema,
};
