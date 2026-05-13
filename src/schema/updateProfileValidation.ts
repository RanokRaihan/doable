import z from "zod";
const phoneSchema = z.string().refine(
  (val) => {
    const digitsOnly = val.replace(/\D/g, "");
    return digitsOnly.length === 10 || digitsOnly.length === 11;
  },
  {
    message: "Phone number must be a valid US or BD phone number ",
  },
);
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
  phone: phoneSchema,

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
