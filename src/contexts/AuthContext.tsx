"use client";

import { LoggedinUser } from "@/lib/types/auth";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from "react";

interface AuthContextType {
  user: LoggedinUser | null;
  isAuthenticated: boolean;
  setUser: (user: LoggedinUser | null) => void;
  refreshUser: () => Promise<void>;
  clearUser: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  setUser: () => {},
  refreshUser: async () => {},
  clearUser: () => {},
});

interface AuthProviderProps {
  children: ReactNode;
  initialUser: LoggedinUser | null;
}

interface GetMeResponse {
  success: boolean;
  data: LoggedinUser;
}

export function AuthProvider({ children, initialUser }: AuthProviderProps) {
  const [user, setUser] = useState<LoggedinUser | null>(initialUser);

  // Call this after login if you don't have user data from response
  const refreshUser = useCallback(async () => {
    const fetchUrl = new URL(
      "/api/v1/auth/current-user",
      process.env.NEXT_PUBLIC_BACKEND_URL!,
    );
    try {
      const response = await fetch(fetchUrl.toString(), {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        setUser(null);
        return;
      }

      const data: GetMeResponse = await response.json();
      if (data.success && data.data) {
        setUser(data.data);
        return;
      }
      setUser(null);
    } catch {
      setUser(null);
    }
  }, []);

  // Call this after logout
  const clearUser = useCallback(() => {
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        setUser,
        refreshUser,
        clearUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
