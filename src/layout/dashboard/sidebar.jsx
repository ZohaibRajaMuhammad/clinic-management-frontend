"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ChevronDown, ChevronUp, Lock, ChevronRight, Heart } from "lucide-react";
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
    <div
      className={`
        bg-background 
        w-[250px] md:w-[18%] 
        h-screen 
        pl-1
        pr-3
        shadow
        top-0 left-0 z-[40]
        fixed md:sticky
        transition-transform duration-300 ease-in-out
        ${sideBarOn ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0
      `}
    >
      {/* Company Logo */}
      <div className="w-full flex gap-0 items-center">
        <div className="flex items-center p-4 justify-between gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary">
            <Heart className="h-6 w-6 text-white fill-white" />
          </div>
          <h1 className="text-foreground text-xl">Health Care</h1>
        </div>
      </div>

      {/* Nav Items */}
      <ul className="flex flex-col ">
        {navItems.map((item, index) => {
          const isActive = pathname === item.path;
          const isOpen = openIndex === index;

          return (
            <li key={index}>
              <button
                onClick={() =>
                  !item.subNavItems && handleNavClick(item.path || "/")
                }
                className={`
                  flex items-center justify-between w-full
                  font-semibold text-left capitalize cursor-pointer
                  rounded-[6px]
                  py-2 sm:py-3 px-6 my-1
                  text-[14px] sm:text-[15px]
                  border-l-[5px]
                  ${
                    isActive
                      ? "border-primary text-primary bg-primary/20"
                      : "border-transparent text-foreground"
                  }
                  hover:bg-primary/20 hover:text-primary hover:border-primary
                  transition-all
                `}
              >
                {/* Left icon */}
                <div className="flex items-center space-x-2">
                  {item.icon ? (
                    <item.icon className="w-5 h-5" />
                  ) : (
                    <ChevronRight className="w-5 h-5" />
                  )}
                  <span>{item.text}</span>
                </div>

                {/* Dropdown arrow for subNavItems */}
                {item.subNavItems && (
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggle(index);
                    }}
                    className="p-1"
                  >
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </div>
                )}
              </button>

              {/* Sub Navigation */}
              {item.subNavItems && (
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    isOpen ? "max-h-[500px]" : "max-h-0"
                  }`}
                >
                  <ul>
                    {item.subNavItems.map((sub, subIndex) => {
                      const isSubActive = pathname === sub.path;
                      return (
                        <li key={subIndex}>
                          <button
                            onClick={() => handleNavClick(sub.path)}
                            className={`
                              block w-full text-left 
                              pl-14 pr-4 py-2 text-[14px] rounded
                              ${
                                isSubActive
                                  ? "text-primary bg-primary/20"
                                  : "text-foreground"
                              }
                              hover:bg-primary/20 hover:text-primary
                              transition-all
                            `}
                          >
                            {sub.text}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </li>
          );
        })}
      </ul>

{/* <div className="absolute top-4 z-80 bg-orange-500"> */}


          {/* </div> */}
      
    </div>
  );
}

export default Sidebar;
