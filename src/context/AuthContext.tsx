import { createContext, useState, useEffect, type ReactNode } from "react";
import { authAPI } from "../api/api";
import { AxiosError } from "axios";

interface User {
  id: string;
  email: string;
  username: string;
  role?: string;
  token: string;
}

interface AuthContextType {
  user: User | null;
  login: (identifier: string, password: string) => Promise<void>;
  register: (
    username: string,
    email: string,
    password: string
  ) => Promise<void>;
  logout: () => void;
  deleteAccount: () => Promise<void>;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const handleError = (error: unknown, fallbackMessage: string) => {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.message || error.message || fallbackMessage
      );
    }
    if (error instanceof Error) {
      throw new Error(error.message || fallbackMessage);
    }
    throw new Error(fallbackMessage);
  };

  const login = async (identifier: string, password: string) => {
    try {
      const userData = await authAPI.login({ identifier, password });
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", userData.token);
    } catch (error) {
      handleError(error, "Login failed");
    }
  };

  const register = async (
    username: string,
    email: string,
    password: string
  ) => {
    try {
      const userData = await authAPI.register({ username, email, password });
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", userData.token);
    } catch (error) {
      handleError(error, "Registration failed");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  const deleteAccount = async () => {
    try {
      await authAPI.deleteAccount();
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
    } catch (error: unknown) {
      handleError(error, "Failed to delete account");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        deleteAccount,
        isAuthenticated: !!user,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
