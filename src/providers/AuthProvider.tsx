"use client";

import {
  AuthContextType,
  AuthProviderProps,
  LoggedinUser,
} from "@/lib/types/auth";
import { useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  setUser: () => {},
  refreshUser: () => {},
  clearUser: () => {},
});

export function AuthProvider({ children, initialUser }: AuthProviderProps) {
  const [user, setUser] = useState<LoggedinUser | null>(initialUser);
  const router = useRouter();

  // Sync state when server re-fetches initialUser
  useEffect(() => {
    setUser(initialUser);
  }, [initialUser]);

  // Triggers a server-side re-fetch of initialUser via router refresh
  const refreshUser = useCallback(() => {
    router.refresh();
  }, [router]);

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
