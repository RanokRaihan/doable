import { getCookie } from "@/actions/common/cookie";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { ShieldX } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function UnauthorizedPage() {
  const user = await getCurrentUser();
  console.log("UnauthorizedPage - current user:", user); // Debug log --- IGNORE ---
  const unauthorizedAttempt = await getCookie("unauthorizedAttempt");
  if (!unauthorizedAttempt) {
    redirect("/");
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center space-y-6 p-8">
        <div className="w-20 h-20 mx-auto bg-red-100 rounded-full flex items-center justify-center">
          <ShieldX className="w-10 h-10 text-red-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Access Denied</h1>
        <p className="text-gray-600 max-w-md">
          You don&apos;t have permission to access this page. Please contact
          support if you believe this is an error.
        </p>
        <div className="flex gap-4 justify-center">
          <Button asChild variant="outline">
            <Link href="/">Go Home</Link>
          </Button>
          <Button asChild>
            <Link href="/tasks">Report Issue</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
