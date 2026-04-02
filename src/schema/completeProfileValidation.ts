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
    .min(1, "Phone number is required")
    .regex(/^\+?[0-9\s\-().]{7,20}$/, "Please enter a valid phone number"),
  address: z
    .string()
    .trim()
    .min(1, "Address is required")
    .min(5, "Please enter a complete address"),
  gender: z.enum(["MALE", "FEMALE", "OTHER", "PREFER_NOT_TO_SAY"], {
    error: "Please select a valid option",
  }),
});

export default CompleteProfileSchema;
