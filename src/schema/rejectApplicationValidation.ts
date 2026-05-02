import { z } from "zod";

const RejectApplicationSchema = z.object({
  rejectionReason: z.string().min(10, "Reason must be at least 10 characters long"),
});

export type RejectApplicationFormData = z.infer<typeof RejectApplicationSchema>;

export default RejectApplicationSchema;
