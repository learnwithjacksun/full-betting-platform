import { NavLink } from "react-router-dom";
import { sidebarTabs } from "@/constants/data";
import { ButtonWithLoader } from "../ui";
import { useAuth } from "@/hooks";

export default function Sidebar() {
  const { logout, loading, user } = useAuth();
  return (
    <div className="w-[250px] bg-secondary border-r border-line h-[calc(100dvh-70px)] md:flex hidden flex-col">
      <ul className="flex flex-col">
        {sidebarTabs.map((tab) => (
          <li key={tab.path} className="">
            <NavLink
              to={tab.path}
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

      {user && (<div className="mt-auto w-[90%] mx-auto space-y-2 mb-4">
        <ButtonWithLoader
          initialText="Logout"
          loadingText="Logging out..."
          loading={loading}
          onClick={logout}
          className="w-full bg-red-600 text-white h-12 rounded-full"
        />
      </div>)}
    </div>
  );
}
