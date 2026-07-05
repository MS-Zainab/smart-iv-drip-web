import { createContext, useContext, useEffect, useMemo, useState } from "react";
import axiosInstance from "../api/axiosInstance";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("smartiv_user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem("smartiv_token") || null;
  });

  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);

    try {
      const response = await axiosInstance.post("/auth/login", {
        email,
        password,
      });

      const { token, user } = response.data;

      localStorage.setItem("smartiv_token", token);
      localStorage.setItem("smartiv_user", JSON.stringify(user));

      setToken(token);
      setUser(user);

      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message:
          error?.response?.data?.message || "Login failed. Please try again.",
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("smartiv_token");
    localStorage.removeItem("smartiv_user");
    setToken(null);
    setUser(null);
  };

  useEffect(() => {
    const savedToken = localStorage.getItem("smartiv_token");
    const savedUser = localStorage.getItem("smartiv_user");

    if (savedToken) setToken(savedToken);
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      isAuthenticated: !!token,
      login,
      logout,
      setUser,
      setToken,
    }),
    [user, token, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);