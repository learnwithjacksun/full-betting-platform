import { ButtonWithLoader, InputWithIcon } from "@/components/ui";
import { AuthLayout } from "@/layouts";
import { Mail, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "@/hooks";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  forgotPasswordSchema,
  type ForgotPasswordSchema,
} from "@/schemas/auth";

export default function ForgottenPassword() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordSchema>({
    resolver: zodResolver(forgotPasswordSchema),
  });
  const { forgotPassword, loading } = useAuth();

  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState<string | null>(null);

  const onSubmit = async (data: ForgotPasswordSchema) => {
    const result = await forgotPassword(data.email);
    if (result) {
      setSubmitted(true);
      setEmail(data.email);
    }
  };

  if (submitted) {
    return (
      <AuthLayout
        title="Check Your Email"
        subtitle="We've sent password reset instructions"
      >
        <div className="space-y-6 text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Mail size={32} className="text-primary" />
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-sm text-muted">
              We've sent password reset instructions to
            </p>
            <p className="text-sm font-semibold text-main">{email}</p>
            <p className="text-xs text-muted pt-2">
              Please check your email and follow the instructions to reset your
              password. If you don't see the email, check your spam folder.
            </p>
          </div>

          <div className="pt-4 space-y-3">
            <p className="text-sm text-muted">Didn't receive the email?</p>
            <button
              onClick={() => {
                setSubmitted(false);
                setEmail(null);
              }}
              className="text-sm font-semibold text-primary hover:text-red-500 transition-colors"
            >
              Try another email address
            </button>
          </div>

          <div className="pt-4 border-t border-line">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-sm text-muted hover:text-primary transition-colors"
            >
              <ArrowLeft size={16} />
              Back to Login
            </Link>
          </div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Forgot Password?"
      subtitle="No worries, we'll help you reset it"
    >
      <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-2">
          <p className="text-sm text-muted">
            Enter your email address and we'll send you instructions to reset
            your password.
          </p>
        </div>

        <InputWithIcon
          icon={<Mail size={20} />}
          label="Email Address"
          id="email"
          placeholder="Enter your email address"
          type="email"
          {...register("email")}
          error={errors.email?.message}
          className="bg-foreground"
        />

        <ButtonWithLoader
          initialText="Send Reset Link"
          loadingText="Sending..."
          loading={loading}
          type="submit"
          className="w-full btn-primary h-12 rounded-full text-base font-semibold shadow-lg hover:shadow-xl transition-all"
        />

        <div className="text-center pt-2">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-sm text-muted hover:text-primary transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Login
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}
