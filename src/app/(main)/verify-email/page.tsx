import { sendVerificationEmailAction } from "@/actions/auth/authAction";
import VerifyEmailCheck from "@/components/verify-email/VerifyEmailCheck";
import VerifyEmailPrompt from "@/components/verify-email/VerifyEmailPrompt";
import { getEmailVerificationStatus } from "@/lib/auth/getEmailVerificationStatus";
import { requireAuth } from "@/lib/auth/requireAuth";

interface PageProps {
  searchParams: Promise<{ token?: string; callbackUrl?: string }>;
}

export default async function VerifyEmailPage({ searchParams }: PageProps) {
  const user = await requireAuth();

  const { token, callbackUrl } = await searchParams;

  if (token) {
    return (
      <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
        <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="mb-6 text-center text-2xl font-bold text-slate-900">
            Verify your email
          </h1>
          <VerifyEmailCheck token={token} callbackUrl={callbackUrl} />
        </div>
      </main>
    );
  }

  const verificationStatus = await getEmailVerificationStatus();

  return (
    <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="mb-6 text-center text-2xl font-bold text-slate-900">
          Verify your email
        </h1>
        <VerifyEmailPrompt
          email={user.email}
          verificationStatus={verificationStatus}
          sendVerificationEmail={sendVerificationEmailAction}
        />
      </div>
    </main>
  );
}
