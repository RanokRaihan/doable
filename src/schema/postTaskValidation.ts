import { TaskCategory, TaskPriority } from "@/lib/types";
import z from "zod";

const PostTaskSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title must be 200 characters or less"),
  description: z.string().min(1, "Description is required"),
  category: z.enum(
    Object.values(TaskCategory) as [string, ...string[]],
    { error: "Please select a category" },
  ),
  priority: z.enum(Object.values(TaskPriority) as [string, ...string[]], {
    error: "Please select a priority",
  }),
  location: z
    .string()
    .min(1, "Location is required")
    .max(255, "Location must be 255 characters or less"),
  baseCompensation: z
    .number({ error: "Please enter a valid amount" })
    .positive("Base compensation must be positive"),
  scheduledAt: z.string().min(1, "Scheduled date is required"),
  estimatedDuration: z
    .number({ error: "Please enter a valid duration" })
    .int("Duration must be a whole number")
    .positive("Estimated duration is required"),
  expiresAt: z.string().optional(),
});

export type PostTaskFormData = z.infer<typeof PostTaskSchema>;

export default PostTaskSchema;
