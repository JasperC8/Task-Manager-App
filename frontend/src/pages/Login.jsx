import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

// Unify API base usage
const API_BASE =
  (import.meta?.env?.VITE_API_BASE || process.env.REACT_APP_API_BASE || "http://localhost:5001") + "/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/auth/login`, { email, password });
      // store token/role and set axios header
      login({ token: res.data.token, role: res.data.role });
      // go straight to the correct dashboard (avoids hitting "/")
      nav(res.data.role === "doctor" ? "/doctor" : "/pharmacy", { replace: true });
    } catch (err) {
      setError(err?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-sm mx-auto">
      <h1 className="text-xl font-semibold mb-4">Login</h1>
      <form onSubmit={submit} className="grid gap-3">
        <input type="email" placeholder="Email" value={email}
               onChange={(e) => setEmail(e.target.value)} required className="border rounded px-3 py-2" />
        <input type="password" placeholder="Password" value={password}
               onChange={(e) => setPassword(e.target.value)} required className="border rounded px-3 py-2" />
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button disabled={loading} className="bg-black text-white px-4 py-2 rounded">
          {loading ? "Signing in…" : "Login"}
        </button>
      </form>
    </div>
  );
}
