// src/hooks/useAuth.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import api, { setAuthToken } from "../api";
import type { AuthUser } from "@/types/auth";
import { decodeUser } from "@/lib/utils";

interface AuthContextType {
  token: string | null;
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, confirmPassword: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("authToken")
  );
  const [user, setUser] = useState<AuthUser | null>(
    token ? decodeUser(token) : null
  );

  useEffect(() => {
    setAuthToken(token);
    setUser(token ? decodeUser(token) : null);
  }, [token]);

  const login = async (email: string, password: string) => {
    const res = await api.post("/auth/login", { email, password }, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    const jwt = res.data.token;
    localStorage.setItem("authToken", jwt);
    setToken(jwt);
  };

  const register = async (email: string, password: string, confirmPassword: string) => {
    const res = await api.post("/auth/register", { email, password, confirmPassword }, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    const jwt = res.data.token;
    localStorage.setItem("authToken", jwt);
    setToken(jwt);
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
