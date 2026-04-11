import z from "zod";

const UpdateProfileSchema = z.object({
  name: z
    .string()
    .trim()
    .refine(
      (val) => val === "" || val.length >= 2,
      "Name must be at least 2 characters",
    )
    .refine(
      (val) => val === "" || val.length <= 100,
      "Name must be less than 100 characters",
    ),
  dateOfBirth: z.string().refine((val) => {
    if (!val) return true;
    const date = new Date(val);
    if (isNaN(date.getTime())) return false;
    const minAge = new Date();
    minAge.setFullYear(minAge.getFullYear() - 13);
    return date <= minAge;
  }, "You must be at least 13 years old"),
  phone: z.string().trim().refine((val) => {
    if (!val) return true;
    return /^01\d{9}$/.test(val);
  }, "Phone must be 11 digits, start with 01 and contain only numbers"),
  address: z
    .string()
    .trim()
    .refine(
      (val) => val === "" || val.length <= 255,
      "Address must be less than 255 characters",
    ),
  bio: z
    .string()
    .trim()
    .refine(
      (val) => val === "" || val.length <= 500,
      "Bio must be less than 500 characters",
    ),
  gender: z
    .enum(["MALE", "FEMALE", "OTHER"], {
      error: "Please select a valid option",
    })
    .or(z.literal(""))
    .optional(),
});

export default UpdateProfileSchema;
