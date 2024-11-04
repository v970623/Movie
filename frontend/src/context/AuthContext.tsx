import React, { createContext, useState, useEffect, ReactNode } from "react";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  id: string;
  role: "staff" | "public";
}

interface AuthContextType {
  isAuthenticated: boolean;
  userRole: "staff" | "public" | null;
  login: () => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  userRole: null,
  login: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<"staff" | "public" | null>(null);

  useEffect(() => {
    console.log("Auth state changed:", { isAuthenticated, userRole });
  }, [isAuthenticated, userRole]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode<DecodedToken>(token);
        setUserRole(decoded.role);
        setIsAuthenticated(true);
        console.log("Token found and validated");
      } catch (error) {
        console.error("Token validation failed:", error);
        localStorage.removeItem("token");
        setIsAuthenticated(false);
        setUserRole(null);
      }
    }
  }, []);

  const login = () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode<DecodedToken>(token);
        setUserRole(decoded.role);
        setIsAuthenticated(true);
        console.log("Login successful, decoded token:", decoded);
      } catch (error) {
        console.error("Login failed:", error);
        localStorage.removeItem("token");
        setIsAuthenticated(false);
        setUserRole(null);
      }
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setUserRole(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userRole, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
