import { z } from "zod";

const editWithdrawalRequestValidation = z
  .object({
    amount: z
      .number({ error: "Amount must be a valid number" })
      .positive("Amount must be positive")
      .min(10, "Minimum withdrawal amount is ৳10")
      .optional(),
    note: z
      .string()
      .max(500, "Note must be at most 500 characters")
      .optional(),
  })
  .refine((data) => data.amount !== undefined || data.note !== undefined, {
    message: "At least one field must be provided",
  });

export type EditWithdrawalRequestFormData = z.infer<
  typeof editWithdrawalRequestValidation
>;

export default editWithdrawalRequestValidation;
