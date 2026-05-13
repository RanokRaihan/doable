import { z } from "zod";

const updateWithdrawalMethodValidation = z
  .object({
    methodType: z.enum(["BANK", "MOBILE_BANKING"]).optional(),
    accountName: z
      .string()
      .min(1, "Account name must not be empty")
      .max(100, "Account name must be at most 100 characters")
      .optional(),
    accountNumber: z
      .string()
      .min(1, "Account number must not be empty")
      .max(50, "Account number must be at most 50 characters")
      .optional(),
    bankName: z
      .string()
      .max(100, "Bank name must be at most 100 characters")
      .optional()
      .nullable(),
    branchName: z
      .string()
      .max(100, "Branch name must be at most 100 characters")
      .optional()
      .nullable(),
    routingNumber: z
      .string()
      .max(50, "Routing number must be at most 50 characters")
      .optional()
      .nullable(),
  })
  .refine((d) => Object.values(d).some((v) => v !== undefined), {
    message: "At least one field must be provided to update",
  });

export type UpdateWithdrawalMethodFormData = z.infer<
  typeof updateWithdrawalMethodValidation
>;

export default updateWithdrawalMethodValidation;
