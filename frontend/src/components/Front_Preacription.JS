import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function MyPrescriptions() {
  const [list, setList] = useState([]);

  const fetchPrescriptions = async () => {
    const res = await axios.get('/api/prescriptions/mine', {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    });
    setList(res.data);
  };

  const deletePrescription = async (id) => {
    await axios.delete(`/api/prescriptions/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    });
    fetchPrescriptions();
  };

  useEffect(() => { fetchPrescriptions(); }, []);

  return (
    <ul>
      {list.map(p => (
        <li key={p._id}>
          {p.patientName} – {p.drugName} – {p.dosage}
          <button onClick={() => deletePrescription(p._id)}>Delete</button>
        </li>
      ))}
    </ul>
  );
}