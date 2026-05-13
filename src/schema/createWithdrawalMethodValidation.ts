import { z } from "zod";

const createWithdrawalMethodValidation = z.object({
  methodType: z.enum(["BANK", "MOBILE_BANKING"]),
  accountName: z
    .string()
    .min(1, "Account name is required")
    .max(100, "Account name must be at most 100 characters"),
  accountNumber: z
    .string()
    .min(1, "Account number is required")
    .max(50, "Account number must be at most 50 characters"),
  bankName: z
    .string()
    .min(1, "Bank name is required")
    .max(100, "Bank name must be at most 100 characters"),
  branchName: z.string().max(100, "Branch name must be at most 100 characters"),
  routingNumber: z
    .string()
    .max(50, "Routing number must be at most 50 characters"),
  isDefault: z.boolean(),
});

export type CreateWithdrawalMethodFormData = z.infer<
  typeof createWithdrawalMethodValidation
>;

export default createWithdrawalMethodValidation;
