import { z } from "zod";

const createAdminValidationSchema = z.object({
  password: z
    .string({
      invalid_type_error: "password must be string",
      required_error: "password is required",
    })
    .max(30, "password can not be more then 20 character"),

  admin: z.object({
    name: z.string({
      invalid_type_error: "name must be string",
      required_error: "name is required",
    }),
    email: z.string({
      invalid_type_error: "email must be string",
      required_error: "email is required",
    }),
    contactNumber: z.string({
      invalid_type_error: "contact number must be string",
      required_error: "contact number is required",
    }),
    profilePhoto: z
      .string({
        invalid_type_error: "profile photo must be string",
      })
      .optional(),
  }),
});

export const UserValidation = {
  createAdminValidationSchema,
};
