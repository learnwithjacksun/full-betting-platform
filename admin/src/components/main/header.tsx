import { Link } from "react-router-dom";
import ModeToggle from "../ui/mode-toggle";
import { Menu } from "lucide-react";
import { useState } from "react";
import MobileBar from "./mobilebar";
import { AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks";
import useBets from "@/hooks/useBets";
import { formatNumber } from "@/helpers/formatNumber";

export default function Header() {
  const { user } = useAuth();
  const [isMobileBarOpen, setIsMobileBarOpen] = useState(false);
  const { useBetsQuery } = useBets();
  
  // Fetch bets to update count (only if user is authenticated)
  useBetsQuery();
  
  return (
    <>
      <header className="fixed top-0 inset-x-0 z-50 bg-secondary border-b border-line">
        <nav className="main flex items-center justify-between h-[70px]">
          <Link to="/" className="center gap-2">
            <h3 className="text-2xl font-light tracking-tight font-bbh hidden md:block">
              Protection <span className="text-red-600">Pools</span> .
            </h3>
            <h3 className="text-xl font-light tracking-tight font-bbh md:hidden">
              P <span className="text-red-600">P</span> .
            </h3>
          </Link>
          <div className="center gap-2">
            <div className="md:block hidden">
              <ModeToggle />
            </div>

            {!user && (
              <div className="center gap-2">
                <Link
                  to="/login"
                  className="btn text-sm h-10 border border-line px-4 rounded-full"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn btn-primary text-sm h-10 px-4 rounded-full"
                >
                  Register
                </Link>
              </div>
            )}

            {user && (
              <div className="center gap-2 md:gap-4">
               
                <div className="center gap-2 border border-line md:p-2 p-1 rounded-full pr-4 md:pr-4">
                  <div className="bg-green-600 font-space text-white w-8 h-8 center rounded-full">
                    &#8358;
                  </div>
                  <div>
                    <p className="text-[10px] text-muted">Wallet</p>
                    <div className="font-space text-xs font-bold">{formatNumber(user?.wallet || 0)}</div>
                  </div>
                </div>
                <Link
                  to="/profile"
                  className="center gap-2 rounded-full bg-foreground md:p-2 md:pl-4"
                >
                  <p className="text-xs hidden font-medium md:block text-main/80">
                    {user?.username}
                  </p>
                  <div className="h-8 w-8 center rounded-full bg-primary overflow-hidden text-white font-medium font-space">
                    {user?.username?.charAt(0)}
                  </div>
                </Link>
              </div>
            )}

            <div className="cursor-pointer md:hidden flex items-center justify-center h-10 w-10">
              <Menu size={20} onClick={() => setIsMobileBarOpen(true)} />
            </div>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {isMobileBarOpen && (
          <MobileBar
            isOpen={isMobileBarOpen}
            onClose={() => setIsMobileBarOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
