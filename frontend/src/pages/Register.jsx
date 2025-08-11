import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE = (import.meta?.env?.VITE_API_BASE || process.env.REACT_APP_API_BASE || "http://localhost:5001") + "/api";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "doctor" });
  const [error, setError] = useState("");
  const nav = useNavigate();

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault(); setError("");
    try {
      await axios.post(`${API_BASE}/auth/register`, form);
      nav("/login");
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
    }
  };

  return (
    <div className="p-6 max-w-sm mx-auto">
      <h1 className="text-xl font-semibold mb-4">Register</h1>
      <form onSubmit={submit} className="grid gap-3">
        <input name="name" placeholder="Name" value={form.name} onChange={onChange} required className="border rounded px-3 py-2"/>
        <input type="email" name="email" placeholder="Email" value={form.email} onChange={onChange} required className="border rounded px-3 py-2"/>
        <input type="password" name="password" placeholder="Password" value={form.password} onChange={onChange} required className="border rounded px-3 py-2"/>
        <select name="role" value={form.role} onChange={onChange} className="border rounded px-3 py-2">
          <option value="doctor">Doctor</option>
          <option value="pharmacy">Pharmacy</option>
        </select>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button className="bg-black text-white px-4 py-2 rounded">Create account</button>
      </form>
    </div>
  );
}
