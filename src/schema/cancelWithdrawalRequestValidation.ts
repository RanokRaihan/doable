import { z } from "zod";

const cancelWithdrawalRequestValidation = z.object({
  cancellationReason: z
    .string()
    .max(500, "Cancellation reason must be at most 500 characters")
    .optional(),
});

export type CancelWithdrawalRequestFormData = z.infer<
  typeof cancelWithdrawalRequestValidation
>;

export default cancelWithdrawalRequestValidation;
