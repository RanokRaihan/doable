import Link from "next/link";
import RegisterForm from "./RegisterForm";

const RegisterFormContainer = ({ callbackUrl }: { callbackUrl?: string }) => {
  const loginHref = callbackUrl
    ? `/login?callbackUrl=${encodeURIComponent(callbackUrl)}`
    : "/login";

  return (
    <div className="flex-1 flex flex-col bg-ds-bg h-full overflow-y-auto [&_button[type=submit]]:rounded-full [&_button[type=submit]]:bg-ds-orange [&_button[type=submit]]:text-white [&_button[type=submit]]:hover:bg-orange-600">
      {/* Top bar spacer */}
      <div className="flex justify-end px-6 pt-6 sm:px-10 sm:pt-8" />

      {/* Center content */}
      <div className="flex-1 flex items-center justify-center px-6 py-6 sm:px-10">
        <div className="w-full max-w-[440px]">
          {/* Heading */}
          <div className="mb-6">
            <h2 className="font-serif text-[clamp(28px,3vw,38px)] leading-[1.04] tracking-[-0.02em] text-ds-ink mb-2">
              Create{" "}
              <span className="italic text-ds-orange">your account</span>
            </h2>
            <p className="text-[15px] text-ds-ink-2">
              Enter your details to get started — it takes about 30 seconds.
            </p>
          </div>

          {/* OAuth buttons */}
          <div className="grid grid-cols-2 gap-2.5 mb-4">
            <button
              type="button"
              className="flex items-center justify-center gap-2.5 h-11 px-4 rounded-full bg-white border border-ds-line-2 text-[14px] font-medium text-ds-ink cursor-pointer hover:bg-ds-bg-2 hover:border-ds-ink transition-colors"
            >
              <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]">
                <path
                  fill="#4285F4"
                  d="M22.5 12.27c0-.79-.07-1.54-.2-2.27H12v4.51h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.32z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"
                />
              </svg>
              Google
            </button>
            <button
              type="button"
              className="flex items-center justify-center gap-2.5 h-11 px-4 rounded-full bg-white border border-ds-line-2 text-[14px] font-medium text-ds-ink cursor-pointer hover:bg-ds-bg-2 hover:border-ds-ink transition-colors"
            >
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-[18px] h-[18px]"
              >
                <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.27-.01-1.01-.02-1.99-3.2.7-3.87-1.54-3.87-1.54-.52-1.32-1.27-1.68-1.27-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.75 2.69 1.25 3.34.95.1-.74.4-1.25.72-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.45.11-3.03 0 0 .97-.31 3.18 1.18a11 11 0 015.79 0c2.21-1.49 3.18-1.18 3.18-1.18.62 1.58.23 2.74.11 3.03.74.81 1.18 1.84 1.18 3.1 0 4.42-2.69 5.4-5.25 5.68.41.36.78 1.06.78 2.14 0 1.55-.01 2.79-.01 3.17 0 .31.21.68.8.56C20.21 21.39 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5z" />
              </svg>
              GitHub
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3.5 my-4 text-[11px] font-medium uppercase tracking-[0.14em] text-ds-ink-3">
            <div className="flex-1 h-px bg-ds-line" />
            or with email
            <div className="flex-1 h-px bg-ds-line" />
          </div>

          {/* Form */}
          <RegisterForm callbackUrl={callbackUrl} />

          {/* Swap CTA */}
          <p className="mt-4 text-center text-[14px] text-ds-ink-2">
            Already have an account?{" "}
            <Link
              href={loginHref}
              className="text-ds-orange-ink font-semibold hover:underline"
            >
              Sign in
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

export default RegisterFormContainer;
