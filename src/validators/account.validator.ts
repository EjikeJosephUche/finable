import { z } from "zod";
export const accountValidator = z.object({
  firstName: z.string().min(1, "First name is required"),
  surname: z.string().min(1, "Surname is required"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string().min(1, "Phone number is required"),
  dateOfBirth: z
    .string()
    .min(1, "Date of birth is required")
    .regex(/^\d{2}-\d{2}-\d{4}$/, "Date of birth must be in DD-MM-YYYY format"),
});
export type AccountValidator = z.infer<typeof accountValidator>;
