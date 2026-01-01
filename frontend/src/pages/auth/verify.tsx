import { ButtonWithLoader, OtpInput } from "@/components/ui";
import { AuthLayout } from "@/layouts";
import { useState, useEffect } from "react";
import { Mail, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import useAuth from "@/hooks/useAuth";
import { useAuthStore } from "@/store";
import { toast } from "sonner";

export default function Verify() {
  const { verifyOtp, resendOtp, loading } = useAuth();
  const { user } = useAuthStore();
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);

  // Redirect if user is already verified
  useEffect(() => {
    if (user?.isVerified) {
      window.location.href = "/";
    }
  }, [user]);

  const handleOtpComplete = (code: string) => {
    setOtp(code);
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (otp.length !== 6) {
      setError("Please enter the complete verification code");
      return;
    }
    
    try {
      await verifyOtp(otp);
    } catch (error) {
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: { message?: string } } };
        setError(axiosError.response?.data?.message || "Invalid verification code");
      } else {
        setError("Invalid verification code");
      }
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    
    try {
      await resendOtp();
      setResendCooldown(60);
      const interval = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  return (
    <AuthLayout
      title="Verify Your Email"
      subtitle="We've sent a verification code to your email"
    >
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="flex items-center justify-center mb-4">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Mail size={32} className="text-primary" />
          </div>
        </div>

        <div className="text-center space-y-2 pb-2">
          <p className="text-sm text-muted">
            Enter the 6-digit code sent to
          </p>
          <p className="text-sm font-semibold text-main">
            {user?.email || "your email"}
          </p>
        </div>

        <OtpInput
          length={6}
          onComplete={handleOtpComplete}
          error={error}
        />

        <div className="text-center">
          <p className="text-sm text-muted mb-2">
            Didn't receive the code?
          </p>
          <button
            type="button"
            onClick={handleResend}
            disabled={resendCooldown > 0}
            className="text-sm w-full font-semibold text-primary hover:text-red-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {resendCooldown > 0
              ? `Resend code in ${resendCooldown}s`
              : "Resend Verification Code"}
          </button>
        </div>

        <ButtonWithLoader
          initialText="Verify Email"
          loadingText="Verifying..."
          loading={loading}
          type="submit"
          disabled={otp.length !== 6}
          className="w-full btn-primary h-12 rounded-full text-base font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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