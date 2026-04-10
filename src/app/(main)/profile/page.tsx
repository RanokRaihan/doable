import OnboardingBanner from "@/components/profile/OnboardingBanner";

export default async function ProfilePage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Overview</h1>
      <OnboardingBanner />
      <p className="text-slate-500 mt-6">Overview content goes here.</p>
    </div>
  );
}
