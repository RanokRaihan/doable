import { z } from "zod";

const ApplyTaskSchema = z.object({
  message: z.string().min(10, "Message must be at least 10 characters long"),
  proposedCompensation: z
    .number({ error: "Please enter a valid amount" })
    .positive("Proposed compensation must be positive"),
});

export type ApplyTaskFormData = z.infer<typeof ApplyTaskSchema>;

export default ApplyTaskSchema;
