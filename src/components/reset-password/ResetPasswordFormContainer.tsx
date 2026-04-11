import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Sparkles } from "lucide-react";
import Link from "next/link";
import ResetPasswordForm from "./ResetPasswordForm";

type ResetPasswordFormContainerProps = {
  token: string;
  email: string;
};

const ResetPasswordFormContainer = ({
  token,
  email,
}: ResetPasswordFormContainerProps) => {
  return (
    <div className="w-full lg:w-1/2 flex flex-col overflow-y-auto bg-gray-50">
      <div className="w-full max-w-lg mx-auto my-auto py-6 sm:py-12 px-6 sm:px-12">
        {/* Mobile Logo */}
        <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-gray-900">Get It Done</span>
        </div>

        <Card className="border-0 shadow-xl bg-white">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl font-bold text-center">
              Set a new password
            </CardTitle>
            <CardDescription className="text-center">
              Your new password must be at least 8 characters
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-5">
            <ResetPasswordForm token={token} email={email} />
          </CardContent>

          <CardFooter className="flex justify-center pb-6">
            <p className="text-sm text-gray-600">
              Remember your password?{" "}
              <Link
                href="/login"
                className="text-blue-600 hover:text-blue-700 font-semibold hover:underline"
              >
                Sign in
              </Link>
            </p>
          </CardFooter>
        </Card>

        {/* Terms */}
        <p className="mt-6 text-center text-xs text-gray-500">
          By continuing, you agree to our{" "}
          <Link href="/terms" className="text-blue-600 hover:underline">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="text-blue-600 hover:underline">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ResetPasswordFormContainer;
