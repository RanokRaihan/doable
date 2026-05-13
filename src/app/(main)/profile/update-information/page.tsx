import { getMyProfileAction } from "@/actions/user/userAction";
import UpdateInformationForm from "@/components/profile/UpdateInformationForm";
import { AlertCircle, Pencil } from "lucide-react";
import { redirect } from "next/navigation";

export default async function UpdateInformationPage() {
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
  if (result?.data?.emailVerified === false) {
    redirect("/verify-email");
  }
  if (result?.data?.profileStatus === "INCOMPLETE") {
    redirect("/complete-profile");
  }
  const { name, dateOfBirth, phone, address, bio, gender } = result.data;

  return (
    <div className="max-w-xl">
      {/* Page header */}
      <div className="mb-6 flex items-start gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-blue-100">
          <Pencil className="size-5 text-blue-600" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-900">
            Update Information
          </h1>
          <p className="mt-0.5 text-sm text-slate-500">
            Edit your personal details. Only changed fields will be updated.
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <UpdateInformationForm
          name={name}
          dateOfBirth={dateOfBirth}
          phone={phone}
          address={address}
          bio={bio}
          gender={gender}
        />
      </div>
    </div>
  );
}
