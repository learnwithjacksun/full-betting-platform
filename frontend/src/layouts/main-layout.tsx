import {
  Header,
  Sidebar,
  Betslip,
  FloatingBetslipButton,
} from "@/components/main";
import { Pattern } from "@/components/ui";
import { Outlet } from "react-router-dom";
import { useState } from "react";

export default function MainLayout() {
  const [isBetslipOpen, setIsBetslipOpen] = useState(false);

  return (
    <Pattern>
      <Header />
      <div className="flex h-[100dvh] pt-[70px]">
        <Sidebar />
        <main className="flex-1 md:px-10 px-4 overflow-y-auto hide-scrollbar md:py-10 py-7">
          <Outlet />
        </main>
        {/* Desktop Betslip */}
        <div className="hidden lg:block">
          <Betslip />
        </div>
      </div>
      {/* Mobile Betslip */}
      <Betslip
        isMobile
        isOpen={isBetslipOpen}
        onClose={() => setIsBetslipOpen(false)}
      />
      {/* Mobile Floating Betslip Button */}
      <FloatingBetslipButton onClick={() => setIsBetslipOpen(true)} />
    </Pattern>
  );
}
