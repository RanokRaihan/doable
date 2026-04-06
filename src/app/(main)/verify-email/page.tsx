import VerifyEmailCheck from "@/components/verify-email/VerifyEmailCheck";
import VerifyEmailPrompt from "@/components/verify-email/VerifyEmailPrompt";
import { requireAuth } from "@/lib/auth/requireAuth";

interface PageProps {
  searchParams: Promise<{ token?: string; callbackUrl?: string }>;
}

export default async function VerifyEmailPage({ searchParams }: PageProps) {
  const user = await requireAuth();

  const { token, callbackUrl } = await searchParams;

  return (
    <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="mb-6 text-center text-2xl font-bold text-slate-900">
          Verify your email
        </h1>

        {token ? (
          <VerifyEmailCheck token={token} callbackUrl={callbackUrl} />
        ) : (
          <VerifyEmailPrompt email={user.email} />
        )}
      </div>
    </main>
  );
}
