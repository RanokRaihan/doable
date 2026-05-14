import type { Metadata } from "next";
import { getMyProfileAction } from "@/actions/user/userAction";
import AvatarUploadDialog from "@/components/profile/AvatarUploadDialog";

export const metadata: Metadata = {
  title: "My Profile",
  description: "View and manage your Doable profile, avatar, and account details.",
};
import { cn } from "@/lib/utils";
import {
  AlertCircle,
  BadgeCheck,
  CheckCircle2,
  Pencil,
  XCircle,
} from "lucide-react";
import Link from "next/link";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatGender(gender: string) {
  return gender.charAt(0) + gender.slice(1).toLowerCase();
}

export default async function ProfilePage() {
  const result = await getMyProfileAction();

  if (!result.success || !("data" in result)) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 flex items-start gap-3">
        <AlertCircle className="size-5 shrink-0 text-red-500 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-red-700">
            Failed to load profile
          </p>
          <p className="text-xs text-red-500 mt-0.5">
            {"message" in result
              ? result.message
              : "Something went wrong. Please try again."}
          </p>
        </div>
      </div>
    );
  }

  const user = result.data;
  const greeting = getGreeting();
  const firstName = user.name.split(" ")[0];
  const initials = getInitials(user.name);

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          {greeting}, {firstName}!
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Here&apos;s an overview of your account.
        </p>
      </div>

      {/* Profile card */}
      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
        <div className="flex flex-col sm:flex-row gap-6 p-6">
          {/* Avatar column */}
          <div className="flex flex-col items-center gap-3 sm:w-36 shrink-0">
            <div className="relative">
              {user.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.image}
                  alt={user.name}
                  className="size-24 rounded-full object-cover border-2 border-slate-200"
                />
              ) : (
                <div className="size-24 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-2xl select-none border-2 border-slate-200">
                  {initials}
                </div>
              )}
              {user.emailVerified && (
                <BadgeCheck className="absolute -bottom-1 -right-1 size-6 text-blue-600 bg-white rounded-full" />
              )}
            </div>

            <AvatarUploadDialog />
          </div>

          {/* Info grid */}
          <div className="flex-1 min-w-0">
            <dl className="divide-y divide-slate-100">
              <InfoRow label="Full Name" value={user.name} />

              <InfoRow label="Email" value={user.email} />

              {user.phone && (
                <InfoRow label="Phone" value={user.phone} />
              )}

              {user.dateOfBirth && (
                <InfoRow
                  label="Date of Birth"
                  value={formatDate(user.dateOfBirth)}
                />
              )}

              {user.address && (
                <InfoRow label="Address" value={user.address} />
              )}

              {user.gender && (
                <InfoRow label="Gender" value={formatGender(user.gender)} />
              )}

              {user.bio && (
                <div className="flex items-start py-3 gap-4">
                  <dt className="w-32 shrink-0 text-xs font-medium text-slate-400 uppercase tracking-wide mt-0.5">
                    Bio
                  </dt>
                  <dd className="text-sm text-slate-800 font-medium leading-relaxed">
                    {user.bio}
                  </dd>
                </div>
              )}

              <div className="flex items-center py-3 gap-4">
                <dt className="w-32 shrink-0 text-xs font-medium text-slate-400 uppercase tracking-wide">
                  Role
                </dt>
                <dd>
                  <span
                    className={cn(
                      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold",
                      user.role === "ADMIN"
                        ? "bg-violet-100 text-violet-700"
                        : "bg-blue-50 text-blue-600",
                    )}
                  >
                    {user.role}
                  </span>
                </dd>
              </div>

              <div className="flex items-center py-3 gap-4">
                <dt className="w-32 shrink-0 text-xs font-medium text-slate-400 uppercase tracking-wide">
                  Profile Status
                </dt>
                <dd>
                  <span
                    className={cn(
                      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold",
                      user.profileStatus === "COMPLETE"
                        ? "bg-emerald-50 text-emerald-700"
                        : user.profileStatus === "INCOMPLETE"
                          ? "bg-amber-50 text-amber-700"
                          : "bg-red-50 text-red-600",
                    )}
                  >
                    {user.profileStatus}
                  </span>
                </dd>
              </div>

              <div className="flex items-center py-3 gap-4">
                <dt className="w-32 shrink-0 text-xs font-medium text-slate-400 uppercase tracking-wide">
                  Email Verified
                </dt>
                <dd className="flex items-center gap-1.5">
                  {user.emailVerified ? (
                    <>
                      <CheckCircle2 className="size-4 text-emerald-500" />
                      <span className="text-sm text-emerald-700 font-medium">
                        Verified
                      </span>
                    </>
                  ) : (
                    <>
                      <XCircle className="size-4 text-red-400" />
                      <span className="text-sm text-red-600 font-medium">
                        Not verified
                      </span>
                    </>
                  )}
                </dd>
              </div>

              <div className="flex items-center py-3 gap-4">
                <dt className="w-32 shrink-0 text-xs font-medium text-slate-400 uppercase tracking-wide">
                  Sign-in via
                </dt>
                <dd className="text-sm text-slate-700">
                  {user.provider === "GOOGLE" ? "Google" : "Email & Password"}
                </dd>
              </div>

              <div className="flex items-start py-3 gap-4">
                <dt className="w-32 shrink-0 text-xs font-medium text-slate-400 uppercase tracking-wide mt-0.5">
                  Member ID
                </dt>
                <dd className="text-xs text-slate-400 font-mono break-all">
                  {user.id}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="border-t border-slate-100 bg-slate-50 px-6 py-4 flex items-center justify-between">
          <p className="text-xs text-slate-400">
            Keep your profile information up to date.
          </p>
          <Link
            href="/profile/update-information"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
          >
            <Pencil className="size-3.5" />
            Update Information
          </Link>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center py-3 gap-4">
      <dt className="w-32 shrink-0 text-xs font-medium text-slate-400 uppercase tracking-wide">
        {label}
      </dt>
      <dd className="text-sm text-slate-800 font-medium truncate">{value}</dd>
    </div>
  );
}
