"use client"
import { useState } from "react";

import Sidebar from "./sidebar";
import TopBar from "./TopBar";
import { AirVent, ClipboardPlus, LayoutDashboard, Settings, Users } from "lucide-react";
import { getNavData, useNavData } from "./config-navData";

const navItems = [
  { text: "Dashboard", icon: LayoutDashboard, path: "/" },
  { text: "Income", icon: Users, path: "/income" },
  { text: "Expense", icon: ClipboardPlus, path: "/expense" },
  { text: "Al Suggestion", icon: AirVent, path: "/alsuggestion" },
  { text: "Settings", icon: Settings, path: "/settings" },
];

function Page({ children }) {
  const [sideBarOn, setSideBarOn] = useState(false);
   const navItems = useNavData();

  return (
    <div
      className="
        flex justify-between 
      bg-primary/8
        relative min-h-screen
        
      "
    >
      {/* Sidebar */}
      <Sidebar
        navItems={navItems}
        // navItems={getNavData()}
        sideBarOn={sideBarOn}
        setSideBarOn={setSideBarOn}
      />

      {/* Overlay only on mobile when sidebar open */}
      {sideBarOn && (
        <div
          onClick={() => setSideBarOn(false)}
          className="
            fixed inset-0 bg-black/50 z-[998] 
            block md:hidden
          "
        />
      )}

      {/* Right Side */}
      <div
        className="
          w-full md:w-[82%] 
          py-0 
          transition-colors duration-200
        "
      >
        <TopBar setSideBarOn={setSideBarOn} />
        <div className="p-2 sm:p-8">
          {children}
          </div>
      </div>
    </div>
  );
}

export default Page;
