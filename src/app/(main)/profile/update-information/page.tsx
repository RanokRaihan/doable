import { Pencil } from "lucide-react";

export default function UpdateInformationPage() {
  return (
    <div className="max-w-xl">
      <div className="mb-6 flex items-start gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-blue-100">
          <Pencil className="size-5 text-blue-600" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-900">
            Update Information
          </h1>
          <p className="mt-0.5 text-sm text-slate-500">
            Edit your personal details and profile information.
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-500">
        This page is under construction. The form to update your profile
        information will appear here.
      </div>
    </div>
  );
}
