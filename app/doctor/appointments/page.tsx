"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function DoctorAppointmentsPage() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAppointments = async () => {
    try {
      const res = await api.get("/appointments/me");
      setAppointments(res.data.data);
    } catch (error) {
      console.error("Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      await api.patch(`/appointments/${id}/status`, { status });
      fetchAppointments(); // Refresh list
    } catch (error) {
      alert("Failed to update status");
    }
  };

  if (loading) return <div>Loading appointments...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Appointments</h1>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 font-semibold text-slate-700">Patient</th>
              <th className="px-6 py-4 font-semibold text-slate-700">Date & Time</th>
              <th className="px-6 py-4 font-semibold text-slate-700">Hospital</th>
              <th className="px-6 py-4 font-semibold text-slate-700">Status</th>
              <th className="px-6 py-4 font-semibold text-slate-700 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {appointments.map((apt) => (
              <tr key={apt.id} className="hover:bg-slate-50 transition">
                <td className="px-6 py-4 font-medium text-slate-900">
                  {apt.patient.name}
                  <span className="block text-xs text-slate-500 font-normal">{apt.patient.email}</span>
                </td>
                <td className="px-6 py-4 text-slate-600">
                  {new Date(apt.date).toLocaleDateString()}
                  <span className="block text-xs text-slate-500">
                    {new Date(apt.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-600">{apt.hospital.name}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    apt.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                    apt.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                    apt.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                    'bg-slate-100 text-slate-800'
                  }`}>
                    {apt.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  {apt.status === 'PENDING' && (
                    <>
                      <button
                        onClick={() => handleStatusUpdate(apt.id, 'CONFIRMED')}
                        className="text-green-600 hover:text-green-800 font-medium"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(apt.id, 'CANCELLED')}
                        className="text-red-600 hover:text-red-800 font-medium"
                      >
                        Decline
                      </button>
                    </>
                  )}
                  {apt.status === 'CONFIRMED' && (
                    <button
                      onClick={() => handleStatusUpdate(apt.id, 'COMPLETED')}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Complete
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {appointments.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                  No appointments found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
