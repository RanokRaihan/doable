"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from "react";

interface User {
  id: string;
  email: string;
  role: "user" | "admin";
  name: string;
  image?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
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
  initialUser: User | null;
}

interface GetMeResponse {
  success: boolean;
  data: User;
}

export function AuthProvider({ children, initialUser }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(initialUser);

  // Call this after login if you don't have user data from response
  const refreshUser = useCallback(async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/V1/auth/me`,
        {
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        },
      );

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
