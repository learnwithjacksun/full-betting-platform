import {
  Header,
  Sidebar
} from "@/components/main";
import { Pattern } from "@/components/ui";
import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "@/hooks";
import { useEffect, useState } from "react";
import { Loader } from "lucide-react";

export default function MainLayout() {
  const { user, checkAuth } = useAuth();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const verifyAuth = async () => {
      setIsChecking(true);
      await checkAuth();
      setIsChecking(false);
    };
    verifyAuth();
  }, [checkAuth]);

  // Show loading state while checking authentication
  if (isChecking) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/" replace />;
  }

  return (
    <Pattern>
      <Header />
      <div className="flex h-[100dvh] pt-[70px]">
        <Sidebar />
        <main className="flex-1 md:px-10 px-4 overflow-y-auto hide-scrollbar md:py-10 py-7">
          <Outlet />
        </main>
      
      </div>
     
    </Pattern>
  );
}
