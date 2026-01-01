import { ButtonWithLoader, InputWithIcon } from "@/components/ui";
import { AuthLayout } from "@/layouts";
import { Lock, ArrowLeft, CheckCircle2 } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { useState } from "react";
import type { ResetPasswordSchema } from "@/schemas/auth";
import useAuth from "@/hooks/useAuth";

export default function NewPassword() {
  const { resetPassword, loading } = useAuth();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [passwordStrength, setPasswordStrength] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  });

  const checkPasswordStrength = (password: string) => {
    setPasswordStrength({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (name === "password") {
      checkPasswordStrength(value);
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};

    if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

   
    if (token) {
      resetPassword({
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        token: token as string,
      } as ResetPasswordSchema & { token: string });
    }
  };

  const allRequirementsMet = Object.values(passwordStrength).every(Boolean);

  return (
    <AuthLayout
      title="Create New Password"
      subtitle="Choose a strong password to secure your account"
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        <InputWithIcon
          icon={<Lock size={20} />}
          label="New Password"
          name="password"
          id="password"
          type="password"
          placeholder="Enter your new password"
          value={formData.password}
          onChange={handleChange}
          required
          error={errors.password}
          className="bg-foreground"
        />

        {formData.password && (
          <div className="space-y-2 p-3 bg-foreground rounded-lg border border-line">
            <p className="text-xs font-semibold text-muted mb-2">
              Password Requirements:
            </p>
            <div className="space-y-1.5">
              {[
                { key: "length", label: "At least 8 characters" },
                { key: "uppercase", label: "One uppercase letter" },
                { key: "lowercase", label: "One lowercase letter" },
                { key: "number", label: "One number" },
                { key: "special", label: "One special character" },
              ].map((req) => (
                <div
                  key={req.key}
                  className={`flex items-center gap-2 text-xs ${
                    passwordStrength[req.key as keyof typeof passwordStrength]
                      ? "text-green-600"
                      : "text-muted"
                  }`}
                >
                  <CheckCircle2
                    size={14}
                    className={
                      passwordStrength[req.key as keyof typeof passwordStrength]
                        ? "text-green-600"
                        : "text-muted opacity-50"
                    }
                  />
                  <span>{req.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <InputWithIcon
          icon={<Lock size={20} />}
          label="Confirm Password"
          name="confirmPassword"
          id="confirmPassword"
          type="password"
          placeholder="Re-enter your new password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
          error={errors.confirmPassword}
          className="bg-foreground"
        />

        <ButtonWithLoader
          initialText="Reset Password"
          loadingText="Resetting..."
          loading={loading}
          type="submit"
          disabled={
            !allRequirementsMet ||
            formData.password !== formData.confirmPassword
          }
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
