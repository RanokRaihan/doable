import type { Metadata } from "next";
import ResetPasswordFormContainer from "@/components/reset-password/ResetPasswordFormContainer";
import ResetPasswordLeftSection from "@/components/reset-password/ResetPasswordLeftSection";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Reset Password",
  description: "Choose a new password for your Doable account.",
  robots: { index: false },
};

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
