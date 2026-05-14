import type { Metadata } from "next";
import RegisterFormContainer from "@/components/register/RegisterFormContainer";
import RegisterLeftSection from "@/components/register/RegisterLeftSection";

export const metadata: Metadata = {
  title: "Create Account",
  description:
    "Join Doable for free. Create an account to post tasks, hire local helpers, or start earning money on your schedule.",
  robots: { index: false },
};

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const { callbackUrl } = await searchParams;

  return (
    <main className="h-screen flex">
      <RegisterLeftSection />
      <RegisterFormContainer callbackUrl={callbackUrl} />
    </main>
  );
}
