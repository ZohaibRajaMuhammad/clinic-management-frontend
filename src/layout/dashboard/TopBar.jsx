"use client";

import React, { useState, useRef, useCallback } from "react";
import {
  Menu,
  Search,
  Bell,
  Sun,
  Moon,
  Home,
  User,
  LogOut,
} from "lucide-react";
import { useThemeContext } from "../../context/ThemeContext";
import { useAuthContext } from "../../context/AuthContext";
import { usePathname, useRouter } from "next/navigation";

export default function TopBar({ setSideBarOn }) {
  const { toggleTheme, theme } = useThemeContext();
  const { logout, getUserDetails } = useAuthContext();
  const userData = getUserDetails();

  

  return (
    <div
      className="
        h-[55px] w-full 
        flex items-center justify-between 
        px-2 sm:px-4 gap-2 py-10   
        bg-background
      "
    >
      {/* Left: Menu button (xs only) */}
      <button
        onClick={() => setSideBarOn(true)}
        className="block md:hidden p-2 rounded hover:bg-foreground/10"
      >
        <Menu className="w-5 h-5 text-foreground" />
      </button>

      {/* <h1 className="md:w-[60%] md:text-4xl text-foreground/80">
        Welcome Back 👋
      </h1> */}

      {/* <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4"> */}
        <div className="md:w-[60%] mt-1">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground/80">
            Welcome back, Moiz 👋
          </h1>
          <p className="text-sm text-foreground/70 mt-1">
            there is the latest update for the last 7 days. check now
          </p>
        </div>
        {/* <div className="flex gap-3">
          <select className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-foreground/70">
            <option>Week</option>
            <option>Month</option>
            <option>Year</option>
          </select>
          <button className="px-6 py-2 bg-primary text-white rounded-lg flex items-center gap-2">
            <Uploa size={18} />
            Export
          </button>
        </div> */}
      {/* </div> */}

      {/* Center: Search box (hidden on xs) */}
      <div className="hidden sm:block flex-grow">
        <div className="relative w-full">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-foreground" />
          <input
            type="text"
            placeholder="Search or type command"
            className="
              w-full py-2 pl-9 pr-3 text-sm rounded-lg
              bg-primary/10
              border border-primary !focus:ring-0
              text-foreground
            "
          />
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-2">
        {/* Search button (only xs) */}
        <button className="flex sm:hidden p-2 rounded bg-primary">
          <Search className="w-4 h-4 text-primary" />
        </button>

        {/* Notifications */}
        <button className="p-2 rounded-md bg-primary/10 border-primary border ">
          <Bell className="w-4 h-4 text-primary " />
        </button>

        {/* Dark/Light toggle */}
        <button
          className="p-2 rounded-md bg-primary/10 border-primary border"
          onClick={() => {
            let changedTheme = theme === "dark" ? "light" : "dark";
            toggleTheme(changedTheme);
          }}
        >
         {theme == "dark" ? (
            <Sun className="w-4 h-4 text-foreground" />
          ) : (
            <Moon className="w-4 h-4 text-foreground" />
          )} 
          {/* <Moon className="w-4 h-4 text-foreground" /> */}
        </button>

        {/* Avatar + Name */}
        <div className="flex items-center gap-2 ">
          <span
            className="
              hidden sm:block py-1.5  rounded-md 
              text-sm text-foreground 
              bg-primary/15
              border border-primary md:min-w-28 text-center
            "
          >
            
       {userData ? userData.name : "Moiz Ahmed"}
          </span>

          <AccountPopover
            data={[
              { label: "Home", href: "/", icon: Home },
              { label: "Profile", href: "/dashboard/profile", icon: User },
            ]}
            logoutFunction={logout}
            userData={userData}
          />
        </div>
      </div>
    </div>
  );
}

function AccountPopover({ data, logoutFunction, userData }) {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const popoverRef = useRef(null);

  const handleToggle = useCallback(() => {
    setOpen((p) => !p);
  }, []);

  const handleClickOutside = useCallback((e) => {
    if (popoverRef.current && !popoverRef.current.contains(e.target)) {
      setOpen(false);
    }
  }, []);

  React.useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [handleClickOutside]);

  const handleClickItem = (path) => {
    setOpen(false);
    router.push(path);
  };

  return (
    <div className="relative" ref={popoverRef}>
      <button
        onClick={handleToggle}
        className="w-10 h-10 rounded-full overflow-hidden border border-primary"
      >
        <img
          src="/assets/profileIcon.png"
          alt="Profile Icon"
          className="w-full h-full object-cover"
        />
      </button>

      {open && (
        <div
          className="
            absolute right-0 mt-2 w-52
            bg-background 
            rounded-md shadow-lg z-50
          "
        >
          <div className="p-3 border-b border-primary/70 border-dashed">
            <p className="text-sm font-medium text-foreground">{userData ? userData.fullName : "Moiz Ahmed"}</p>
            <p className="text-xs text-foreground">{userData ? userData.email : "moiz@gmail.com"}</p>
          </div>

          <div className="flex flex-col p-2">
            {data.map((option) => {
              const Icon = option.icon;
              const active = pathname === option.href;
              return (
                <button
                  key={option.label}
                  onClick={() => handleClickItem(option.href)}
                  className={`
                    flex items-center gap-2 px-3 py-2 rounded text-sm
                    ${
                      active
                        ? "bg-primary/20 text-primary"
                        : "text-foreground/80  hover:bg-primary/20 hover:text-primary "
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  {option.label}
                </button>
              );
            })}
          </div>

          <div className="border-t border-primary/70 border-dashed  p-2">
            <button
              onClick={logoutFunction}
              className="flex items-center gap-2 w-full justify-center py-2 text-sm text-red-600 hover:bg-red-50  rounded"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
