import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_BASE_URL;

// Extend AxiosRequestConfig to include silent flag
declare module "axios" {
  export interface AxiosRequestConfig {
    silent?: boolean; // If true, don't show error toasts
  }
}

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Enable cookies/credentials
});

// Request interceptor - no need for token in headers since we use cookies
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors globally
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError<{ success?: boolean; message?: string }>) => {
    const isSilent = error.config?.silent === true;
    const requestUrl = error.config?.url || "";

    // Handle network errors
    if (!error.response) {
      if (!isSilent) {
        toast.error("Network error. Please check your connection.");
      }
      return Promise.reject(error);
    }

    const { status, data } = error.response;

    // Handle 401 Unauthorized - don't show error for checkAuth or public endpoints
    if (status === 401) {
      // Clear user data if stored
      const authStore = (await import("@/store/useAuthStore")).default;
      authStore.getState().setUser(null);
      
      // Don't show error or redirect for silent requests (like checkAuth)
      // or for public endpoints that might fail for unauthenticated users
      if (isSilent || requestUrl.includes("/auth/check")) {
        return Promise.reject(error);
      }
      
      // Only redirect if not already on auth pages
      if (!window.location.pathname.startsWith("/auth") && !window.location.pathname.startsWith("/login") && !window.location.pathname.startsWith("/register")) {
        // Don't redirect, just silently fail - user can still browse
        return Promise.reject(error);
      }
      
      // Only show toast if it's not a silent request
      if (!isSilent) {
        toast.error(data?.message || "Session expired. Please login again.");
      }
      return Promise.reject(error);
    }

    // Handle 403 Forbidden
    if (status === 403) {
      if (!isSilent) {
        toast.error(data?.message || "You don't have permission to perform this action.");
      }
      return Promise.reject(error);
    }

    // Handle 404 Not Found - silent for public content
    if (status === 404) {
      // Don't show error for public endpoints (like matches, etc.)
      if (!isSilent && !requestUrl.includes("/matches") && !requestUrl.includes("/public")) {
        toast.error(data?.message || "Resource not found.");
      }
      return Promise.reject(error);
    }

    // Handle 400 Bad Request and other client errors
    if (status >= 400 && status < 500) {
      if (!isSilent) {
        const errorMessage = data?.message || "An error occurred. Please try again.";
        toast.error(errorMessage);
      }
      return Promise.reject(error);
    }

    // Handle 500+ server errors
    if (status >= 500) {
      if (!isSilent) {
        toast.error("Server error. Please try again later.");
      }
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

// Helper function to make silent API calls (no error toasts)
// Useful for public endpoints or auth checks that might fail for visitors
export const silentApiCall = async <T>(
  apiCall: Promise<T>
): Promise<T> => {
  try {
    return await apiCall;
  } catch (error) {
    return await Promise.reject(error);
  }
};

export default api;