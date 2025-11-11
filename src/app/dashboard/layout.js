"use client";

import { useAuthContext } from "@/context/AuthContext";
import DashLayout from "../../layout/dashboard/index.jsx";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

function Layout({ children }) {
  const { token } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  if (!token) {
    return null;
  }

  return <DashLayout>{children}</DashLayout>;
}

export default Layout;
