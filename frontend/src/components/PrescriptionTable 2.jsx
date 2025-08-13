import React from "react";

export default function PrescriptionTable({ data = [], onDispense }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border">
        <thead>
          <tr className="bg-gray-50">
            <th className="p-2 border">Patient</th>
            <th className="p-2 border">Medication</th>
            <th className="p-2 border">Dosage</th>
            <th className="p-2 border">Instructions</th>
            <th className="p-2 border">Dispensed</th>
            {onDispense && <th className="p-2 border">Action</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((p) => (
            <tr key={p._id}>
              <td className="p-2 border">{p.patientName}</td>
              <td className="p-2 border">{p.medication}</td>
              <td className="p-2 border">{p.dosage}</td>
              <td className="p-2 border">{p.instructions}</td>
              <td className="p-2 border">{p.isDispensed ? "Yes" : "No"}</td>
              {onDispense && (
                <td className="p-2 border">
                  {!p.isDispensed && (
                    <button onClick={() => onDispense(p._id)} className="px-3 py-1 border rounded">Mark dispensed</button>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
