import type { Metadata } from "next";
import LoginFormContainer from "@/components/login/LoginFormContainer";
import LoginLeftSection from "@/components/login/LoginLeftSection";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your Doable account to post tasks or find work near you.",
  robots: { index: false },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const { callbackUrl } = await searchParams;
  return (
    <main className="h-screen flex">
      <LoginLeftSection />
      <LoginFormContainer callbackUrl={callbackUrl} />
    </main>
  );
}
