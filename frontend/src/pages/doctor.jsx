import React, { useEffect, useState } from "react";
import axios from "axios";
import PrescriptionForm from "../components/PrescriptionForm";
import PrescriptionTable from "../components/PrescriptionTable";

const API_BASE = (process.env.REACT_APP_API_BASE || "http://localhost:5001") + "/api";

export default function Doctor() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const load = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(`${API_BASE}/prescriptions/mine`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setList(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      setError(e?.response?.data?.message || e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    load();
  }, []);

  return (
    <div className="p-6 grid gap-6">
      <section>
        <h1 className="text-xl font-semibold mb-2">Issue new prescription</h1>
        <PrescriptionForm onIssued={load} />
        {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
      </section>
      <section>
        <h2 className="text-lg font-medium mb-2">Recently issued</h2>
        {loading ? <p>Loading…</p> : <PrescriptionTable data={list} />}
      </section>
    </div>
  );
}
