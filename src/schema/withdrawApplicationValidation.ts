import { z } from "zod";

const WithdrawApplicationSchema = z.object({
  withdrawalReason: z
    .string()
    .min(10, "Reason must be at least 10 characters long"),
});

export type WithdrawApplicationFormData = z.infer<typeof WithdrawApplicationSchema>;

export default WithdrawApplicationSchema;
