import z from "zod";

const ChangePasswordSchema = z
  .object({
    oldPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "Must be at least 8 characters")
      .regex(/[A-Z]/, "Must contain at least one uppercase letter")
      .regex(/[0-9]/, "Must contain at least one number"),
    confirmNewPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords do not match",
    path: ["confirmNewPassword"],
  })
  .refine((data) => data.oldPassword !== data.newPassword, {
    message: "New password must be different from your current password",
    path: ["newPassword"],
  });

export default ChangePasswordSchema;
