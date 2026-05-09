import { z } from "zod";

const createWithdrawalMethodValidation = z
  .object({
    methodType: z.enum(["BANK", "MOBILE_BANKING"]),
    accountNumber: z
      .string()
      .min(1, "Account number is required")
      .max(50, "Account number must be at most 50 characters"),
    accountName: z
      .string()
      .min(1, "Account name is required")
      .max(100, "Account name must be at most 100 characters"),
    bankName: z
      .string()
      .max(100, "Bank name must be at most 100 characters")
      .optional(),
    branchName: z
      .string()
      .max(100, "Branch name must be at most 100 characters")
      .optional(),
    routingNumber: z
      .string()
      .max(50, "Routing number must be at most 50 characters")
      .optional(),
    isDefault: z.boolean().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.methodType === "BANK" && !data.bankName) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Bank name is required for bank transfers",
        path: ["bankName"],
      });
    }
  });

export type CreateWithdrawalMethodFormData = z.infer<
  typeof createWithdrawalMethodValidation
>;

export default createWithdrawalMethodValidation;
