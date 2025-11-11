'use client'
import { useRouter } from "next/navigation";
import { createContext, useContext, useState, useEffect } from "react";
import jwt from "jsonwebtoken"

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) setToken(storedToken);
  }, []);

  
 

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  const login = (newToken) => {
    setToken(newToken);
  };

  const logout = () => {
    setToken(null);
    router.push("/login");
  };

  
  const getUserDetails = () => {
    
    if (!token) return null;
    try {
      return jwt.decode(token);
    } catch (error) {
      console.error("Invalid token:", error);
      return null;
    }
  };

  return (
    <AuthContext.Provider value={{ token, login, logout, getUserDetails }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};
