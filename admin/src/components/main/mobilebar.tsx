import { X } from "lucide-react";
import { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { sidebarTabs } from "@/constants/data";
import { useAuth, useTheme } from "@/hooks";
import { Sun, Moon } from "lucide-react";
import { ButtonWithLoader } from "../ui";

interface MobileBarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileBar({ isOpen, onClose }: MobileBarProps) {
  const { theme, toggleTheme } = useTheme();
  const { logout, loading, user } = useAuth();
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);
  return (
    <div className="fixed inset-0 z-50">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/10 backdrop-blur"
      />

      <motion.div
        initial={{ opacity: 0, scaleX: 0 }}
        animate={{ opacity: 1, scaleX: 1 }}
        exit={{ opacity: 0, scaleX: 0 }}
        className="w-[70%] origin-left relative h-[100dvh] bg-secondary border-r border-line z-100"
      >
        <header className="flex items-center justify-between h-[70px] px-4">
          <h3 className="text-xl font-light tracking-tight font-bbh md:hidden">
            P <span className="text-red-600">P</span> .
          </h3>

          <button
            className="center p-2 rounded-full bg-foreground"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </header>

        <ul className="flex flex-col">
          {sidebarTabs.map((tab) => (
            <li key={tab.path} className="">
              <NavLink
                to={tab.path}
                onClick={onClose}
                className={({ isActive }) =>
                  isActive
                    ? "bg-red-600 text-white p-4 md:pl-8 flex items-center gap-2 font-space"
                    : " text-muted p-4 md:pl-8 pl-4 flex items-center gap-2 hover:bg-foreground hover:text-main"
                }
              >
                <tab.icon size={20} />
                <span className="text-sm font-space">{tab.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="mt-auto w-[90%] mx-auto space-y-2 mb-4 absolute bottom-0 left-0 right-0">
          <div
            className="center gap-2 h-12 bg-foreground text-sm cursor-pointer rounded-full"
            onClick={toggleTheme}
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}

            <span className="text-xs font-semibold">
              {theme === "dark" ? "Light Mode" : "Dark Mode"}
            </span>
          </div>

          {user && (
            <ButtonWithLoader
              initialText="Logout"
              loadingText="Logging out..."
              loading={loading}
              onClick={logout}
              className="w-full bg-red-600 text-white h-12 rounded-full"
            />
          )}
        </div>
      </motion.div>
    </div>
  );
}
