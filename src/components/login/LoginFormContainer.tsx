import Link from "next/link";
import DemoLogin from "./DemoLogin";
import LoginForm from "./LoginForm";

const LoginFormContainer = ({ callbackUrl }: { callbackUrl?: string }) => {
  const registerHref = callbackUrl
    ? `/register?callbackUrl=${encodeURIComponent(callbackUrl)}`
    : "/register";

  return (
    <div className="flex-1 flex flex-col bg-ds-bg h-full overflow-y-auto [&_button[type=submit]]:rounded-full [&_button[type=submit]]:bg-ds-orange [&_button[type=submit]]:text-white [&_button[type=submit]]:hover:bg-orange-600">
      {/* Top bar */}
      <div className="flex justify-end px-6 pt-6 sm:px-10 sm:pt-8" />

      {/* Center content */}
      <div className="flex-1 flex items-center justify-center px-6 py-6 sm:px-10">
        <div className="w-full max-w-110">
          {/* Heading */}
          <div className="mb-6">
            <h2 className="font-serif text-[clamp(28px,3vw,38px)] leading-[1.04] tracking-[-0.02em] text-ds-ink mb-2">
              Sign in to{" "}
              <span className="italic text-ds-orange">your account</span>
            </h2>
            <p className="text-[15px] text-ds-ink-2">
              Enter your email and password to continue.
            </p>
          </div>

          {/* Demo login */}
          <DemoLogin callbackUrl={callbackUrl} />

          {/* Form */}
          <LoginForm callbackUrl={callbackUrl} />

          {/* Swap CTA */}
          <p className="mt-4 text-center text-[14px] text-ds-ink-2">
            Don&apos;t have an account?{" "}
            <Link
              href={registerHref}
              className="text-ds-orange-ink font-semibold hover:underline"
            >
              Sign up for free
            </Link>
          </p>
        </div>
      </div>

      {/* Bottom legal */}
      <div className="flex flex-wrap items-center justify-between gap-4 px-6 pb-6 sm:px-10 sm:pb-8 pt-4 border-t border-ds-line text-[12px] text-ds-ink-3">
        <span>
          By continuing, you agree to doable&apos;s{" "}
          <Link
            href="/terms"
            className="text-ds-orange-ink hover:underline font-medium"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy"
            className="text-ds-orange-ink hover:underline font-medium"
          >
            Privacy Policy
          </Link>
          .
        </span>
        <span>© 2026 doable, inc.</span>
      </div>
    </div>
  );
};

export default LoginFormContainer;
