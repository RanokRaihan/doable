import CompleteProfileForm from "@/components/profile/CompleteProfileForm";
import { requireAuth } from "@/lib/auth/requireAuth";

interface PageProps {
  searchParams: Promise<{ callbackUrl?: string }>;
}

export default async function CompleteProfilePage({ searchParams }: PageProps) {
  await requireAuth();
  const { callbackUrl } = await searchParams;

  return (
    <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-20">
      <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-slate-900">
            Complete your profile
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            A few more details to get started
          </p>
        </div>

        <CompleteProfileForm callbackUrl={callbackUrl} />
      </div>
    </main>
  );
}
