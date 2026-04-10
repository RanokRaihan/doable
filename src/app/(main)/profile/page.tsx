import OnboardingBanner from "@/components/profile/OnboardingBanner";

export default async function ProfilePage() {
  return (
    <div className="min-h-screen py-12 items-center justify-center">
      <div className="container mx-auto mt-6">
        <OnboardingBanner />
      </div>
    </div>
  );
}
