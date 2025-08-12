import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, allow = [] }) {
  const { isAuthed, role } = useAuth();
  if (!isAuthed) return <Navigate to="/login" replace />;
  // If authed but wrong role, send them to THEIR dashboard (not "/")
  if (allow.length && !allow.includes(role)) return <Navigate to={`/${role}`} replace />;
  return children;
}
