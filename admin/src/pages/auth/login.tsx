import { ButtonWithLoader, InputWithIcon } from "@/components/ui";
import { AuthLayout } from "@/layouts";
import { Lock, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginSchema } from "@/schemas/auth";
import useAuth from "@/hooks/useAuth";

export default function Login() {
  const { login, loading } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginSchema) => {
    login(data);
  };

  return (
    <AuthLayout
      title="Hello, Admin!"
      subtitle="Login to your account to continue"
    >
      <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
        <InputWithIcon
          icon={<Mail size={20} />}
          label="Email Address"
          id="email"
          placeholder="Enter your email address"
          type="email"
          {...register("email")}
          className="bg-foreground"
          error={errors.email?.message}
        />

        <InputWithIcon
          icon={<Lock size={20} />}
          label="Password"
          id="password"
          type="password"
          placeholder="Enter your password"
          {...register("password")}
          error={errors.password?.message}
          className="bg-foreground"
        />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="remember"
              className="w-4 h-4 rounded border-line text-primary focus:ring-primary focus:ring-2 cursor-pointer"
            />
            <label
              htmlFor="remember"
              className="text-sm text-muted cursor-pointer"
            >
              Remember me
            </label>
          </div>
          <Link
            to="/forgot-password"
            className="text-sm font-medium hover:text-red-500 transition-colors text-primary"
          >
            Forgot Password?
          </Link>
        </div>

        <ButtonWithLoader
          initialText="Login to Account"
          loadingText="Logging in..."
          loading={loading}
          type="submit"
          className="w-full btn-primary h-12 rounded-full text-base font-semibold shadow-lg hover:shadow-xl transition-all"
        />

       
      </form>
    </AuthLayout>
  );
}
