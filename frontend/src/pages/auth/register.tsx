import { ButtonWithLoader, InputWithIcon } from "@/components/ui";
import { AuthLayout } from "@/layouts";
import { Lock, Mail, User, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { registerSchema, type RegisterSchema } from "@/schemas/auth";
import { toast } from "sonner";
import useAuth from "@/hooks/useAuth";

export default function Register() {
  const { register: registerUser, loading } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
  });
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const onSubmit = (data: RegisterSchema) => {
    if (!acceptedTerms) {
      toast.warning(
        "You must accept the terms and conditions to create an account"
      );
      return;
    }

    registerUser(data);
  };

  return (
    <AuthLayout
      title="Join the Action!"
      subtitle="Create your account and start betting today"
    >
      <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
        <InputWithIcon
          icon={<User size={20} />}
          label="Username"
          id="username"
          placeholder="e.g John Doe or Scorpion"
          type="text"
          {...register("username")}
          error={errors.username?.message}
          className="bg-foreground"
        />

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

        <InputWithIcon
          icon={<Phone size={20} />}
          label="Phone Number"
          id="phone"
          placeholder="Enter your phone number"
          type="tel"
          {...register("phone")}
          error={errors.phone?.message}
          className="bg-foreground"
        />

        <InputWithIcon
          icon={<Lock size={20} />}
          label="Password"
          id="password"
          type="password"
          placeholder="Minimum 8 characters"
          {...register("password")}
          error={errors.password?.message}
          className="bg-foreground"
        />

        <InputWithIcon
          icon={<Lock size={20} />}
          label="Confirm Password"
          id="confirmPassword"
          type="password"
          placeholder="Re-enter your password"
          {...register("confirmPassword")}
          error={errors.confirmPassword?.message}
          className="bg-foreground"
        />

        <div className="space-y-2">
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="terms"
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
              className="w-4 h-4 mt-1 rounded border-line text-primary focus:ring-primary focus:ring-2 cursor-pointer"
            />
            <label
              htmlFor="terms"
              className="text-sm text-muted cursor-pointer leading-relaxed"
            >
              I agree to the{" "}
              <Link
                to="/terms"
                className="text-primary hover:text-red-500 transition-colors font-medium"
              >
                Terms and Conditions
              </Link>{" "}
              and{" "}
              <Link
                to="/privacy"
                className="text-primary hover:text-red-500 transition-colors font-medium"
              >
                Privacy Policy
              </Link>
            </label>
          </div>
        </div>

        <ButtonWithLoader
          initialText="Create Account"
          loadingText="Creating account..."
          loading={loading}
          type="submit"
          className="w-full btn-primary h-12 rounded-full text-base font-semibold shadow-lg hover:shadow-xl transition-all"
        />

        <div className="text-center text-sm pt-2">
          <span className="text-muted">Already have an account?</span>{" "}
          <Link
            to="/login"
            className="font-semibold hover:text-red-500 transition-colors text-primary"
          >
            Login
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}
