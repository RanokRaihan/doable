import RegisterFormContainer from "@/components/register/RegisterFormContainer";
import RegisterLeftSection from "@/components/register/RegisterLeftSection";

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
