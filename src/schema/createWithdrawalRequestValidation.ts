import { z } from "zod";

const createWithdrawalRequestValidation = z.object({
  withdrawalMethodId: z
    .string()
    .min(1, "Withdrawal method is required"),
  amount: z
    .number({ error: "Amount must be a valid number" })
    .positive("Amount must be positive")
    .min(10, "Minimum withdrawal amount is ৳10"),
  note: z
    .string()
    .max(500, "Note must be at most 500 characters")
    .optional(),
});

export type CreateWithdrawalRequestFormData = z.infer<
  typeof createWithdrawalRequestValidation
>;

export default createWithdrawalRequestValidation;
