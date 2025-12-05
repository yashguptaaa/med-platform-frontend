"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import Link from "next/link";

interface Doctor {
  id: string;
  name: string;
  city: string;
  rating: number;
  yearsOfExperience: number;
}

export default function AdminDoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDoctors = async () => {
    try {
      const res = await api.get("/doctors");
      setDoctors(res.data.data);
    } catch (error) {
      console.error("Failed to fetch doctors", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this doctor?")) return;
    try {
      await api.delete(`/doctors/${id}`);
      setDoctors((prev) => prev.filter((d) => d.id !== id));
    } catch (error) {
      alert("Failed to delete doctor");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Doctors</h1>
        <Link
          href="/admin/doctors/create"
          className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition font-medium"
        >
          Add Doctor
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 font-semibold text-slate-700">Name</th>
              <th className="px-6 py-4 font-semibold text-slate-700">City</th>
              <th className="px-6 py-4 font-semibold text-slate-700">Experience</th>
              <th className="px-6 py-4 font-semibold text-slate-700">Rating</th>
              <th className="px-6 py-4 font-semibold text-slate-700 text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {doctors.map((doctor) => (
              <tr key={doctor.id} className="hover:bg-slate-50 transition">
                <td className="px-6 py-4 font-medium text-slate-900">
                  {doctor.name}
                </td>
                <td className="px-6 py-4 text-slate-600">{doctor.city}</td>
                <td className="px-6 py-4 text-slate-600">{doctor.yearsOfExperience} years</td>
                <td className="px-6 py-4 text-slate-600">{doctor.rating}</td>
                <td className="px-6 py-4 text-right space-x-2">
                  <Link
                    href={`/admin/doctors/${doctor.id}/edit`}
                    className="text-emerald-600 hover:text-emerald-800 font-medium mr-2"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(doctor.id)}
                    className="text-red-600 hover:text-red-800 font-medium"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {doctors.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                  No doctors found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
