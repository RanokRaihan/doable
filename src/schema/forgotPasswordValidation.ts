import z from "zod";

const ForgotPasswordSchema = z.object({
  email: z.email("Please enter a valid email address"),
});

export default ForgotPasswordSchema;
