import type {
  LoginSchema,
  ResetPasswordSchema,
} from "@/schemas/auth";
import { useAuthStore } from "@/store";
import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/config/api";
import { toast } from "sonner";

export default function useAuth() {
  const { user, setUser } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  

  const login = async (data: LoginSchema) => {
    setLoading(true);
    try {
      const response = await api.post("/auth/admin/login", {
        email: data.email,
        password: data.password,
      });

      if (response.data.success) {
        setUser(response.data.user);

        // Check if email verification is required
        if (response.data.requiresVerification) {
          toast.warning("Please verify your email address before logging in.");
          navigate("/verify");
          return response.data;
        }

        toast.success("Login successful!");
        navigate("/home");
        return response.data;
      }
    } catch (error) {
      // Check if verification is required
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as {
          response?: { data?: { requiresVerification?: boolean } };
        };
        if (axiosError.response?.data?.requiresVerification) {
          toast.warning("Please verify your email address before logging in.");
          navigate("/verify");
        }
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await api.post("/auth/logout");
      setUser(null);
      toast.success("Logged out successfully");
      navigate("/");
    } catch {
      // Even if API call fails, clear local state
      setUser(null);
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  const checkAuth = useCallback(async () => {
    try {
      const response = await api.get("/auth/check", {
        silent: true, // Don't show error toasts for unauthenticated visitors
      });
      if (response.data.success) {
        setUser(response.data.user);
        return response.data.user;
      }
    } catch {
      // If check fails, user is not authenticated (silent - no error toast)
      setUser(null);
      return null;
    }
  }, [setUser]);

 

  const forgotPassword = async (email: string): Promise<boolean> => {
    setLoading(true);
    try {
      const response = await api.post("/auth/forgot-password", { email });
      if (response.data.success) {
        toast.success("Password reset link sent to your email");
        return true;
      }
      return false;
    } catch (error) {
      toast.error((error as Error).message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (
    data: ResetPasswordSchema & { token: string }
  ) => {
    setLoading(true);
    try {
      const response = await api.post("/auth/reset-password", {
        token: data.token,
        newPassword: data.password,
      });
      if (response.data.success) {
        toast.success("Password reset successfully!");
        navigate("/login");
        return response.data;
      }
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async (
    currentPassword: string,
    newPassword: string
  ) => {
    setLoading(true);
    try {
      const response = await api.post("/auth/change-password", {
        currentPassword,
        newPassword,
      });
      if (response.data.success) {
        toast.success("Password changed successfully");
        return response.data;
      }
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (data: Partial<IUser>) => {
    setLoading(true);
    try {
      const response = await api.put("/user/profile", data);
      if (response.data.success) {
        setUser(response.data.user);
        toast.success("Profile updated successfully");
        return response.data;
      }
    } catch (error) {
      toast.error((error as Error).message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    login,
    logout,
    checkAuth,
    forgotPassword,
    resetPassword,
    changePassword,
    updateUser,
  };
}
