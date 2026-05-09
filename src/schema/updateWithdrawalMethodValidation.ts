import { z } from "zod";

const updateWithdrawalMethodValidation = z
  .object({
    methodType: z.enum(["BANK", "MOBILE_BANKING"]).optional(),
    accountNumber: z
      .string()
      .max(50, "Account number must be at most 50 characters")
      .optional(),
    accountName: z
      .string()
      .max(100, "Account name must be at most 100 characters")
      .optional(),
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
  })
  .refine(
    (data) => Object.values(data).some((v) => v !== undefined && v !== ""),
    { message: "At least one field must be provided" },
  );

export type UpdateWithdrawalMethodFormData = z.infer<
  typeof updateWithdrawalMethodValidation
>;

export default updateWithdrawalMethodValidation;
