"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { loginUser, logoutUser, registerUser } from "@/lib/api";

interface User {
  id: string;
  name: string;
  email: string;
  isAuthenticated: boolean;
  accessToken: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string) => {
    const data = await loginUser(email, password);
    setUser(data.user);
    sessionStorage.setItem("accessToken", data?.user.accessToken);
  };

  const register = async (name: string, email: string, password: string) => {
    const data = await registerUser(name, email, password);
    setUser(data.user);
    console.log(data.user.access);
    sessionStorage.setItem("accessToken", data?.user.accessToken);
  };

  const logout = async () => {
    const token = sessionStorage.getItem("accessToken");

    if (!token) {
      throw new Error("No access token");
    }

    const data = await logoutUser(token);

    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
