import { ReactNode } from "react";

export interface LoggedinUser {
  id: string;
  email: string;
  name: string;
  image: string | null;
  role: "USER" | "ADMIN";
  profileStatus: "INCOMPLETE" | "COMPLETE" | "SUSPENDED";
  emailVerified: boolean;
  provider: "CREDENTIALS" | "GOOGLE";
}
export interface AuthContextType {
  user: LoggedinUser | null;
  isAuthenticated: boolean;
  setUser: (user: LoggedinUser | null) => void;
  refreshUser: () => void;
  clearUser: () => void;
}
export interface AuthProviderProps {
  children: ReactNode;
  initialUser: LoggedinUser | null;
}
