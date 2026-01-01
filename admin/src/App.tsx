import { Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import { ScrollToTop } from "@/components/ui";
import {
  Home,
  MyBets,
  Profile,
  Transactions,
  UserDetail,
  Users,
  Wallet,
  WithdrawalRequests,
  Matches,
} from "@/pages/main";
import { ForgottenPassword, NewPassword, Login } from "./pages/auth";
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
  }, []); // Empty dependency array - only run on mount

  return (
    <>
      <ScrollToTop />
      <Toaster position="top-center" richColors />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route>
          <Route path="login" element={<Login />} />
          <Route path="new-password" element={<NewPassword />} />
          <Route path="forgotten-password" element={<ForgottenPassword />} />
        </Route>
        <Route path="/" element={<MainLayout />}>
          <Route path="home" element={<Home />} />
          <Route path="bets" element={<MyBets />} />
          <Route path="profile" element={<Profile />} />
          <Route path="wallet" element={<Wallet />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="users" element={<Users />} />
          <Route path="users/:id" element={<UserDetail />} />
          <Route path="withdrawals" element={<WithdrawalRequests />} />
          <Route path="matches" element={<Matches />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  );
}
