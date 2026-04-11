import ForgotPasswordFormContainer from "@/components/forgot-password/ForgotPasswordFormContainer";
import ForgotPasswordLeftSection from "@/components/forgot-password/ForgotPasswordLeftSection";

export default function ForgotPasswordPage() {
  return (
    <main className="h-screen flex">
      <ForgotPasswordLeftSection />
      <ForgotPasswordFormContainer />
    </main>
  );
}
