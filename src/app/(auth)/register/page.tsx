import RegisterFormContainer from "@/components/register/RegisterFormContainer";
import RegisterLeftSection from "@/components/register/RegisterLeftSection";

export default function RegisterPage() {
  return (
    <main className="min-h-screen flex">
      <RegisterLeftSection />
      <RegisterFormContainer />
    </main>
  );
}
