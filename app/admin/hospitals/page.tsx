"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import Link from "next/link";

interface Hospital {
  id: string;
  name: string;
  city: string;
  rating: number;
}

export default function AdminHospitalsPage() {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchHospitals = async () => {
    try {
      const res = await api.get("/hospitals");
      setHospitals(res.data.data);
    } catch (error) {
      console.error("Failed to fetch hospitals", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHospitals();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this hospital?")) return;
    try {
      await api.delete(`/hospitals/${id}`);
      setHospitals((prev) => prev.filter((h) => h.id !== id));
    } catch (error) {
      alert("Failed to delete hospital");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Hospitals</h1>
        <Link
          href="/admin/hospitals/create"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium"
        >
          Add Hospital
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 font-semibold text-slate-700">Name</th>
              <th className="px-6 py-4 font-semibold text-slate-700">City</th>
              <th className="px-6 py-4 font-semibold text-slate-700">Rating</th>
              <th className="px-6 py-4 font-semibold text-slate-700 text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {hospitals.map((hospital) => (
              <tr key={hospital.id} className="hover:bg-slate-50 transition">
                <td className="px-6 py-4 font-medium text-slate-900">
                  {hospital.name}
                </td>
                <td className="px-6 py-4 text-slate-600">{hospital.city}</td>
                <td className="px-6 py-4 text-slate-600">{hospital.rating}</td>
                <td className="px-6 py-4 text-right space-x-2">
                  <Link
                    href={`/admin/hospitals/${hospital.id}/edit`}
                    className="text-blue-600 hover:text-blue-800 font-medium mr-2"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(hospital.id)}
                    className="text-red-600 hover:text-red-800 font-medium"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {hospitals.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                  No hospitals found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
