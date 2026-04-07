import z from "zod";

const CompleteProfileSchema = z.object({
  dateOfBirth: z
    .string()
    .min(1, "Date of birth is required")
    .refine((val) => {
      const date = new Date(val);
      if (isNaN(date.getTime())) return false;
      const minAge = new Date();
      minAge.setFullYear(minAge.getFullYear() - 13);
      return date <= minAge;
    }, "You must be at least 13 years old"),
  phone: z
    .string()
    .trim()
    .regex(/^01\d{9}$/, {
      message:
        "Phone must be 11 digits, start with 01 and contain only numbers",
    }),
  address: z
    .string()
    .trim()
    .min(1, "Address is required")
    .max(255, "Address must be less than 255 characters"),
  bio: z
    .string()
    .trim()
    .max(500, "Bio must be less than 500 characters")
    .optional(),
  gender: z.enum(["MALE", "FEMALE", "OTHER"], {
    error: "Please select a valid option",
  }),
});

export default CompleteProfileSchema;
