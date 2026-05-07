import { createContext, useContext, useState } from "react";
import { authApi } from "../api/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("li_user");
    return stored ? JSON.parse(stored) : null;
  });

  const login = async (email, password) => {
    const data = await authApi.login(email, password);
    const u = data.user;
    localStorage.setItem("li_user", JSON.stringify(u));
    setUser(u);
    return u;
  };

  const register = async (name, email, password) => {
    const data = await authApi.register(name, email, password);
    const u = data.user;
    localStorage.setItem("li_user", JSON.stringify(u));
    setUser(u);
    return u;
  };

  const logout = async () => {
    await authApi.logout().catch(() => {});
    localStorage.removeItem("li_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const authContext = useContext(AuthContext);

  return authContext;
}
