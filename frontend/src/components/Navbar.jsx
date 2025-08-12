import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { isAuthed, role, logout } = useAuth();
  return (
    <nav className="w-full border-b px-4 py-3 flex items-center justify-between">
      <Link to="/" className="font-semibold">E‑Prescription</Link>
      <div className="flex items-center gap-4">
        {!isAuthed && (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
        {isAuthed && (
          <>
            {role === "doctor" && <Link to="/doctor">Doctor</Link>}
            {role === "pharmacy" && <Link to="/pharmacy">Pharmacy</Link>}
            <button onClick={logout} className="border px-3 py-1 rounded">Logout</button>
          </>
        )}
      </div>
    </nav>
  );
}
