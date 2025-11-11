"use client";
import { useEffect, useState } from "react";
import jwt from "jsonwebtoken";
import {
  Activity,
  ArrowBigRightDash,
  ClipboardClock,
  History,
  LayoutDashboard,
  School,
  ShieldPlus,
  Users,
} from "lucide-react";

export function useNavData() {
  const [navData, setNavData] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    let role = "";
    if (token) {
      try {
        const decoded = jwt.decode(token);

        role = decoded?.role?.toLowerCase();
      } catch (error) {
        console.error("Invalid token:", error);
      }
    }

    const isAdmin = (role) => role === "admin";
    const isDoctor = (role) => role === "doctor";
    const isPatient = (role) => role === "patient";
    const isStaff = (role) => role === "staff";

    const data = [
      { text: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
      {
        text: "Appointment",
        icon: ClipboardClock,
        path: "/dashboard/appointment",
      },
      {
        text: "Case History",
        icon: Activity,
        path: "/dashboard/caseHistory",
      },

      ...(isAdmin(role) || isStaff(role)
        ? [
            {
              text: "Invite",
              icon: ArrowBigRightDash,
              path: "/dashboard/invite",
            },
            {
              text: "Doctors",
              icon: ShieldPlus,
              path: "/dashboard/doctor",
            },
            { text: "Users", icon: Users, path: "/dashboard/users" },
            { text: "Room", icon: School, path: "/dashboard/room" },
          ]
        : []),

      ...(isPatient(role)
        ? [
            {
              text: "Doctors",
              icon: ShieldPlus,
              path: "/dashboard/doctor",
            },
          ]
        : []),
    ];

    setNavData(data);
  }, []);

  return navData;
}
