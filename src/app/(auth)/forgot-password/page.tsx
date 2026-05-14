import type { Metadata } from "next";
import ForgotPasswordFormContainer from "@/components/forgot-password/ForgotPasswordFormContainer";
import ForgotPasswordLeftSection from "@/components/forgot-password/ForgotPasswordLeftSection";

export const metadata: Metadata = {
  title: "Forgot Password",
  description: "Reset your Doable account password. Enter your email and we'll send you a reset link.",
  robots: { index: false },
};

export default function ForgotPasswordPage() {
  return (
    <main className="h-screen flex">
      <ForgotPasswordLeftSection />
      <ForgotPasswordFormContainer />
    </main>
  );
}
