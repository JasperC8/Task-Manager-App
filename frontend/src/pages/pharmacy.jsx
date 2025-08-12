import React, { useEffect, useState } from "react";
import axios from "axios";
import PrescriptionTable from "../components/PrescriptionTable";

const API_BASE = (process.env.REACT_APP_API_BASE || "http://localhost:5001") + "/api";

export default function Pharmacy() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const load = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(`${API_BASE}/prescriptions`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setList(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      setError(e?.response?.data?.message || e.message);
    } finally {
      setLoading(false);
    }
  };

  const onDispense = async (id) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      await axios.put(`${API_BASE}/prescriptions/${id}/dispense`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      load();
    } catch (e) {
      setError(e?.response?.data?.message || e.message);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    load();
  }, []);

  return (
    <div className="p-6 grid gap-6">
      <h1 className="text-xl font-semibold">All prescriptions</h1>
      {error && <p className="text-sm text-red-600">{error}</p>}
      {loading ? <p>Loading…</p> : <PrescriptionTable data={list} onDispense={onDispense} />}
    </div>
  );
}
