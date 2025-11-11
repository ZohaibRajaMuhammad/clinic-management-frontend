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
  ChevronDown,
  Settings,
} from "lucide-react";
import { useThemeContext } from "../../context/ThemeContext";
import { useAuthContext } from "../../context/AuthContext";
import { usePathname, useRouter } from "next/navigation";

export default function TopBar({ setSideBarOn }) {
  const { toggleTheme, theme } = useThemeContext();
  const { logout, getUserDetails } = useAuthContext();
  const userData = getUserDetails();

  return (
    <div className="h-20 w-full flex items-center justify-between px-6 lg:px-8 bg-gradient-to-r from-white to-blue-50 dark:from-slate-900 dark:to-slate-800 border-b border-blue-100 dark:border-slate-700 shadow-lg">
      {/* Left Section */}
      <div className="flex items-center gap-5">
        {/* Menu button for mobile */}
        <button
          onClick={() => setSideBarOn(true)}
          className="block md:hidden p-2.5 rounded-xl bg-white dark:bg-slate-800 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 border border-blue-100 dark:border-slate-600"
        >
          <Menu className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        </button>

        {/* Welcome Section */}
        <div className="hidden md:block">
          <div className="flex items-center gap-3">
            <div className="w-2 h-8 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full"></div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Welcome back, {userData ? userData.name : "Moiz"} 👋
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
                Ready to make today productive and efficient
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Center: Search Box */}
      <div className="hidden lg:block flex-1 max-w-2xl mx-10">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur-sm opacity-20"></div>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-500" />
            <input
              type="text"
              placeholder="Search patients, reports, or commands..."
              className="w-full py-3.5 pl-12 pr-24 text-base rounded-2xl bg-white dark:bg-slate-800 border-2 border-blue-100 dark:border-slate-600 text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 focus:border-blue-300 transition-all shadow-lg"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-3 py-1.5 rounded-xl border border-blue-200 dark:border-blue-700 shadow-sm">
              ⌘K
            </div>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* Search button for mobile */}
        <button className="flex lg:hidden p-3 rounded-2xl bg-white dark:bg-slate-800 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-blue-100 dark:border-slate-600">
          <Search className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        </button>

        {/* Notifications */}
        <button className="relative p-3 rounded-2xl bg-white dark:bg-slate-800 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-blue-100 dark:border-slate-600 group">
          <div className="relative">
            <Bell className="w-5 h-5 text-slate-600 dark:text-slate-400 group-hover:text-blue-600 transition-colors" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white dark:border-slate-800 shadow-lg"></div>
          </div>
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-4 pl-4 border-l border-blue-100 dark:border-slate-700 ml-2">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-base font-bold text-slate-800 dark:text-white">
              {userData ? userData.name : "Moiz Ahmed"}
            </span>
            <span className="text-sm text-blue-600 dark:text-blue-400 font-medium bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded-lg">
              {userData ? userData.role || "Doctor" : "Medical Professional"}
            </span>
          </div>

          <AccountPopover
            data={[
              { label: "Dashboard", href: "/", icon: Home },
              { label: "Profile", href: "/dashboard/profile", icon: User },
              { label: "Settings", href: "/dashboard/settings", icon: Settings },
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
        className="flex items-center gap-3 p-2 rounded-2xl bg-white dark:bg-slate-800 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-blue-100 dark:border-slate-600 group"
      >
        <div className="relative">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 overflow-hidden border-2 border-white dark:border-slate-800 shadow-lg">
            <img
              src="/assets/profileIcon.png"
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-slate-800"></div>
        </div>
        <ChevronDown className={`w-4 h-4 text-blue-600 dark:text-blue-400 transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-3 w-72 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-blue-100 dark:border-slate-700 z-50 overflow-hidden backdrop-blur-lg">
          {/* User Info Header */}
          <div className="p-5 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm border-2 border-white/30 overflow-hidden shadow-lg">
                  <img
                    src="/assets/profileIcon.png"
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-lg font-bold text-white truncate">
                  {userData ? userData.fullName : "Moiz Ahmed"}
                </p>
                <p className="text-sm text-blue-100 truncate">
                  {userData ? userData.email : "moiz@healthcare.com"}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Items */}
          <div className="p-3 bg-white dark:bg-slate-800">
            {data.map((option) => {
              const Icon = option.icon;
              const active = pathname === option.href;
              return (
                <button
                  key={option.label}
                  onClick={() => handleClickItem(option.href)}
                  className={`
                    flex items-center gap-4 w-full px-4 py-3.5 rounded-xl text-sm font-semibold transition-all duration-300 mb-1
                    ${
                      active
                        ? "bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800 shadow-md"
                        : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:shadow-md hover:translate-x-1"
                    }
                  `}
                >
                  <div className={`p-2 rounded-lg ${active ? 'bg-blue-100 dark:bg-blue-900/30' : 'bg-slate-100 dark:bg-slate-700'}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  {option.label}
                </button>
              );
            })}
          </div>

          {/* Logout Section */}
          <div className="border-t border-slate-200 dark:border-slate-700 p-3 bg-white dark:bg-slate-800">
            <button
              onClick={logoutFunction}
              className="flex items-center gap-4 w-full px-4 py-3.5 rounded-xl text-sm font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all duration-300 hover:shadow-md border border-transparent hover:border-red-200 dark:hover:border-red-800"
            >
              <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30">
                <LogOut className="w-4 h-4" />
              </div>
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}