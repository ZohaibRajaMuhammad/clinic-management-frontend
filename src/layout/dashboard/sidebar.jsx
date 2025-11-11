"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ChevronDown, ChevronUp, Lock, ChevronRight, Heart, X } from "lucide-react";
import Image from "next/image";

function Sidebar({ navItems, sideBarOn, setSideBarOn }) {
  const router = useRouter();
  const pathname = usePathname();
  const [openIndex, setOpenIndex] = useState(null);

  const handleNavClick = (path) => {
    router.push(path);
    setSideBarOn(false);
  };

  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {sideBarOn && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setSideBarOn(false)}
        />
      )}
      
      <div
        className={`
          bg-white
          w-[320px] md:w-[340px] 
          h-screen 
          flex flex-col
          border-r border-gray-200
          top-0 left-0 z-40
          fixed md:sticky
          transition-transform duration-300 ease-in-out
          ${sideBarOn ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
          shadow-xl
        `}
      >
        {/* Header Section */}
        <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-600 to-purple-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm border border-white/30">
                <Heart className="h-5 w-5 text-white fill-white/80" />
              </div>
              <div>
                <h1 className="text-white text-lg font-bold tracking-tight">HealthCare Pro</h1>
                <p className="text-white/80 text-xs font-medium">Medical Management</p>
              </div>
            </div>
            <button 
              onClick={() => setSideBarOn(false)}
              className="md:hidden p-2 hover:bg-white/20 rounded-lg transition-all duration-200"
            >
              <X className="h-4 w-4 text-white" />
            </button>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="flex-1 overflow-y-auto py-6 px-4 bg-gray-50/50">
          <nav className="space-y-2">
            {navItems.map((item, index) => {
              const isActive = pathname === item.path;
              const isOpen = openIndex === index;

              return (
                <div key={index} className="group">
                  {/* Main Nav Item */}
                  <button
                    onClick={() =>
                      !item.subNavItems && handleNavClick(item.path || "/")
                    }
                    className={`
                      flex items-center justify-between w-full
                      font-medium text-left capitalize cursor-pointer
                      rounded-lg
                      py-3 px-4
                      text-sm
                      transition-all duration-200
                      ${
                        isActive
                          ? "text-blue-700 bg-blue-50 border-l-4 border-blue-700 shadow-sm"
                          : "text-gray-700 hover:bg-white hover:text-gray-900 hover:shadow-sm border-l-4 border-transparent"
                      }
                    `}
                  >
                    <div className="flex items-center space-x-3">
                      {item.icon ? (
                        <item.icon className={`w-4 h-4 ${isActive ? "text-blue-700" : "text-gray-500"}`} />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      )}
                      <span className="font-semibold tracking-wide">{item.text}</span>
                    </div>

                    {/* Dropdown arrow for subNavItems */}
                    {item.subNavItems && (
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggle(index);
                        }}
                        className={`p-1 rounded transition-colors ${
                          isOpen ? "bg-gray-200" : "hover:bg-gray-200"
                        }`}
                      >
                        {isOpen ? (
                          <ChevronUp className="w-3 h-3 text-gray-600" />
                        ) : (
                          <ChevronDown className="w-3 h-3 text-gray-600" />
                        )}
                      </div>
                    )}
                  </button>

                  {/* Sub Navigation */}
                  {item.subNavItems && (
                    <div
                      className={`overflow-hidden transition-all duration-300 ${
                        isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                      }`}
                    >
                      <div className="ml-8 pl-3 border-l-2 border-gray-200 mt-1 space-y-1">
                        {item.subNavItems.map((sub, subIndex) => {
                          const isSubActive = pathname === sub.path;
                          return (
                            <button
                              key={subIndex}
                              onClick={() => handleNavClick(sub.path)}
                              className={`
                                block w-full text-left 
                                pl-4 pr-4 py-2.5 text-xs rounded-md
                                font-medium tracking-wide
                                transition-all duration-200
                                ${
                                  isSubActive
                                    ? "text-blue-600 bg-blue-50 font-semibold"
                                    : "text-gray-600 hover:text-gray-900 hover:bg-white"
                                }
                              `}
                            >
                              {sub.text}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>

        {/* Footer Section */}
        <div className="p-6 border-t border-gray-200 bg-white">
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-4 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-8 w-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-sm">
                <Lock className="h-3 w-3 text-white" />
              </div>
              <div>
                <p className="text-gray-900 text-sm font-semibold">Secure Portal</p>
                <p className="text-gray-500 text-xs">HIPAA Compliant</p>
              </div>
            </div>
            <p className="text-gray-600 text-xs leading-relaxed font-medium">
              All patient data is encrypted and protected with enterprise-grade security measures.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Sidebar;