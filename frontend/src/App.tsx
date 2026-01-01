import { Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import { ScrollToTop } from "@/components/ui";
import { Home, MyBets, Profile, Wallet } from "@/pages/main";
import {
  ForgottenPassword,
  Register,
  Verify,
  NewPassword,
  Login,
} from "./pages/auth";
import { MainLayout } from "./layouts";
import { NotFound } from "./pages";
import { useEffect } from "react";
import { useAuth } from "@/hooks";

export default function App() {
  const { checkAuth } = useAuth();

  useEffect(() => {
    // Only check auth once on mount
    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Empty dependency array - only run on mount
  

  return (
    <>
      <ScrollToTop />
      <Toaster position="top-center" richColors />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="verify" element={<Verify />} />
          <Route path="new-password" element={<NewPassword />} />
          <Route path="forgotten-password" element={<ForgottenPassword />} />
        </Route>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="bets" element={<MyBets />} />
          <Route path="profile" element={<Profile />} />
          <Route path="wallet" element={<Wallet />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  );
}
