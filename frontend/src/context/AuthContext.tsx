import { createContext, useContext, useState, useEffect } from "react";
import type{ReactNode} from "react";
import client from "../api/client";

type UserRole = "admin" | "manager" | "worker" | null;

interface AuthContextType {
  user: any;
  role: UserRole;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<UserRole>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("role") as UserRole;
    if (token && userRole) {
      setUser({ token });
      setRole(userRole);
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const { data } = await client.post("/auth/login", { email, password });
    const { token, role, user } = data;

    if (!token || !role) throw new Error("Invalid login response");

    localStorage.setItem("token", token);
    localStorage.setItem("role", role);

    setUser(user);
    setRole(role);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setUser(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ user, role, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
