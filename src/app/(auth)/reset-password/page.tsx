import ResetPasswordFormContainer from "@/components/reset-password/ResetPasswordFormContainer";
import ResetPasswordLeftSection from "@/components/reset-password/ResetPasswordLeftSection";
import { redirect } from "next/navigation";

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string; email?: string }>;
}) {
  const { token, email } = await searchParams;

  if (!token || !email) {
    redirect("/forgot-password");
  }

  return (
    <main className="h-screen flex">
      <ResetPasswordLeftSection />
      <ResetPasswordFormContainer token={token} email={email} />
    </main>
  );
}
