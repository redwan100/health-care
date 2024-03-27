import { Gender } from "@prisma/client";
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

const createDoctorValidationSchema = z.object({
  password: z
    .string({
      invalid_type_error: "password must be string",
      required_error: "password is required",
    })
    .max(30, "password can not be more then 20 character"),

  doctor: z.object({
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
    address: z
      .string({
        invalid_type_error: "address number must be string",
      })
      .optional(),

    registrationNumber: z.string({
      invalid_type_error: "registration number must be string",
      required_error: "registration number is required",
    }),
    experience: z
      .number({
        invalid_type_error: "experience  must be number",
      })
      .optional()
      .default(0),

    gender: z.enum([Gender.MALE, Gender.FEMALE]),

    appointmentFee: z.number({
      invalid_type_error: "experience  must be number",
      required_error: "appointment fee is required",
    }),
    qualification: z.string({
      invalid_type_error: "qualification  must be string",
      required_error: "qualification is required",
    }),

    currentWorkingPlace: z.string({
      invalid_type_error: "current working place must be string",
      required_error: "current working place is required",
    }),
    designation: z.string({
      invalid_type_error: "designation must be string",
      required_error: "designation is required",
    }),

    profilePhoto: z
      .string({
        invalid_type_error: "profile photo must be string",
      })
      .optional(),
  }),
});

const createPatientValidationSchema = z.object({
  password: z
    .string({
      invalid_type_error: "password must be string",
      required_error: "password is required",
    })
    .max(30, "password can not be more then 20 character"),

  patient: z.object({
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
    address: z
      .string({
        invalid_type_error: "address number must be string",
      })
      .optional(),

    profilePhoto: z
      .string({
        invalid_type_error: "profile photo must be string",
      })
      .optional(),
  }),
});

export const UserValidation = {
  createAdminValidationSchema,
  createDoctorValidationSchema,
  createPatientValidationSchema,
};
