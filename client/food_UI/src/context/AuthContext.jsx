import { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "../services/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = sessionStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [loading, setLoading] = useState(Boolean(sessionStorage.getItem("token")));

  const login = (userData, token, refreshToken) => {
    sessionStorage.setItem("token", token);
    if (refreshToken) sessionStorage.setItem("refreshToken", refreshToken);
    sessionStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = useCallback(() => {
    const refreshToken = sessionStorage.getItem("refreshToken");
    if (refreshToken) {
      api.post("/auth/logout", { refreshToken }).catch(() => {});
    }
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("refreshToken");
    sessionStorage.removeItem("user");
    setUser(null);
  }, []);

  // Load profile khi có token
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) return;

    const loadProfile = async () => {
      try {
        const res = await api.get("/auth/profile");
        const fresh = res.data.data;
        const savedUser = JSON.parse(sessionStorage.getItem("user") || "{}");
        setUser({ ...savedUser, ...fresh });
        sessionStorage.setItem("user", JSON.stringify({ ...savedUser, ...fresh }));
      } catch {
        // token hết hạn và không refresh được -> logout
        logout();
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [logout]);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
