import LoginFormContainer from "@/components/login/LoginFormContainer";
import LoginLeftSection from "@/components/login/LoginLeftSection";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const { callbackUrl } = await searchParams;
  console.log("LoginPage searchParams:", { callbackUrl });
  return (
    <main className="h-screen flex">
      <LoginLeftSection />
      <LoginFormContainer callbackUrl={callbackUrl} />
    </main>
  );
}
