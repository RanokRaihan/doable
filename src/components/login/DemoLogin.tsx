"use client";
import { demoLoginAction } from "@/actions/auth/authAction";
import { useAuth } from "@/providers/AuthProvider";
import { CircleUser, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";

type DemoUserKey = "demoUser1" | "demoUser2";

const DemoLogin = ({ callbackUrl }: { callbackUrl?: string }) => {
  const [loadingKey, setLoadingKey] = useState<DemoUserKey | null>(null);
  const { setUser } = useAuth();
  const router = useRouter();

  const handleDemoLogin = async (userKey: DemoUserKey) => {
    setLoadingKey(userKey);
    const res = await demoLoginAction(userKey);
    if (res?.success) {
      setUser(res.data.user);
      toast.success(res.message || "Logged in successfully!");
      router.push(callbackUrl || "/profile");
    } else {
      toast.error(res?.message || "Demo login failed. Please try again.");
      setLoadingKey(null);
    }
  };

  return (
    <div className="mb-4">
      <p className="text-[13px] font-semibold text-ds-ink mb-1">
        Try it instantly
      </p>
      <p className="text-[13px] text-ds-ink-2 mb-3">
        Skip the form — sign in as a sample user to explore the app.
      </p>

      <div className="grid grid-cols-2 gap-2.5">
        <Button
          type="button"
          variant="outline"
          className="rounded-full  text-ds-orange border-ds-orange"
          disabled={loadingKey !== null}
          onClick={() => handleDemoLogin("demoUser1")}
        >
          {loadingKey === "demoUser1" ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <CircleUser className="size-4" />
          )}
          Demo Sign in 1
        </Button>
        <Button
          type="button"
          variant="outline"
          className="rounded-full  text-ds-orange border-ds-orange"
          disabled={loadingKey !== null}
          onClick={() => handleDemoLogin("demoUser2")}
        >
          {loadingKey === "demoUser2" ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <CircleUser className="size-4" />
          )}
          Demo Sign in 2
        </Button>
      </div>

      <div className="flex items-center gap-3.5 mt-4 text-[11px] font-medium uppercase tracking-[0.14em] text-ds-ink-3">
        <div className="flex-1 h-px bg-ds-line" />
        or sign in with credentials
        <div className="flex-1 h-px bg-ds-line" />
      </div>
    </div>
  );
};

export default DemoLogin;
