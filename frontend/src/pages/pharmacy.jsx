import React, { useEffect, useState } from "react";
import axios from "axios";
import PrescriptionTable from "../components/PrescriptionTable";

const API_BASE = (import.meta?.env?.VITE_API_BASE || process.env.REACT_APP_API_BASE || "http://localhost:5001") + "/api";

export default function Pharmacy() {
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
    } finally {
      setLoading(false);
    }
  };

  const onDispense = async (id) => {
    const token = localStorage.getItem("token");
    await axios.put(`${API_BASE}/prescriptions/${id}/dispense`, {}, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    load();
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="p-6 grid gap-6">
      <h1 className="text-xl font-semibold">All prescriptions</h1>
      {loading ? <p>Loading…</p> : <PrescriptionTable data={list} onDispense={onDispense} />}
    </div>
  );
}