import React, { createContext, useContext, useMemo, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [role, setRole] = useState(() => localStorage.getItem("role"));
  const [name, setName] = useState(() => localStorage.getItem("name"));

  // Restore Authorization header on refresh
  useEffect(() => {
    const t = localStorage.getItem("token");
    if (t) axios.defaults.headers.common.Authorization = `Bearer ${t}`;
  }, []);

  const login = ({ token, role, name }) => {
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
    if (name) localStorage.setItem("name", name);
    setToken(token);
    setRole(role);
    if (name) setName(name);
    // critical: attach token for subsequent requests
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("name");
    setToken(null);
    setRole(null);
    setName(null);
    delete axios.defaults.headers.common.Authorization;
  };

  const value = useMemo(
    () => ({ token, role, name, isAuthed: !!token, login, logout }),
    [token, role, name]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);

