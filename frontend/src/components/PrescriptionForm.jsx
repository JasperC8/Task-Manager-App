import React, { useState } from "react";
import axios from "axios";

const API_BASE = (import.meta?.env?.VITE_API_BASE || process.env.REACT_APP_API_BASE || "http://localhost:5001") + "/api";

export default function PrescriptionForm({ onIssued }) {
  const [form, setForm] = useState({ patientName: "", medication: "", dosage: "", instructions: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      const token = localStorage.getItem("token");
      await axios.post(`${API_BASE}/prescriptions/issue`, form, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setForm({ patientName: "", medication: "", dosage: "", instructions: "" });
      onIssued?.();
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
    } finally { setLoading(false); }
  };

  return (
    <form onSubmit={submit} className="grid gap-3 max-w-md">
      <input name="patientName" placeholder="Patient name" value={form.patientName} onChange={onChange} required className="border rounded px-3 py-2" />
      <input name="medication" placeholder="Medication" value={form.medication} onChange={onChange} required className="border rounded px-3 py-2" />
      <input name="dosage" placeholder="Dosage" value={form.dosage} onChange={onChange} required className="border rounded px-3 py-2" />
      <textarea name="instructions" placeholder="Instructions" value={form.instructions} onChange={onChange} className="border rounded px-3 py-2" />
      {error && <p className="text-red-600 text-sm">{error}</p>}
      <button disabled={loading} className="bg-black text-white px-4 py-2 rounded">{loading ? "Issuing…" : "Issue prescription"}</button>
    </form>
  );
}
