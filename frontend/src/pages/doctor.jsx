import React, { useEffect, useState } from "react";
import axios from "axios";
import PrescriptionForm from "../components/PrescriptionForm";
import PrescriptionTable from "../components/PrescriptionTable";

const API_BASE = (import.meta?.env?.VITE_API_BASE || process.env.REACT_APP_API_BASE || "http://localhost:5001") + "/api";

export default function Doctor() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_BASE}/prescriptions`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setList(Array.isArray(res.data) ? res.data : []);
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="p-6 grid gap-6">
      <section>
        <h1 className="text-xl font-semibold mb-2">Issue new prescription</h1>
        <PrescriptionForm onIssued={load} />
      </section>
      <section>
        <h2 className="text-lg font-medium mb-2">Recently issued</h2>
        {loading ? <p>Loading…</p> : <PrescriptionTable data={list} />}
      </section>
    </div>
  );
}
