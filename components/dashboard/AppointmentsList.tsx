"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { format } from "date-fns";

interface Appointment {
  id: string;
  date: string;
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
  reason: string;
  patient: {
    id: string;
    name: string;
    email: string;
  };
  doctor: {
    name: string;
  };
}

export function AppointmentsList() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAppointments = async () => {
    try {
      const res = await api.get("/appointments/me?role=DOCTOR");
      setAppointments(res.data.data);
    } catch (error) {
      console.error("Failed to fetch appointments", error);
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
      // Optimistic update or refetch
      fetchAppointments();
    } catch (error) {
      console.error("Failed to update status", error);
      alert("Failed to update status");
    }
  };

  if (loading) return <div className="text-slate-500">Loading appointments...</div>;

  if (appointments.length === 0) {
    return (
      <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-200">
        <p className="text-slate-500">No appointments found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {appointments.map((appt) => (
        <div
          key={appt.id}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
        >
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                appt.status === "PENDING" ? "bg-amber-100 text-amber-700" :
                appt.status === "CONFIRMED" ? "bg-emerald-100 text-emerald-700" :
                appt.status === "CANCELLED" ? "bg-red-100 text-red-700" :
                "bg-slate-100 text-slate-700"
              }`}>
                {appt.status}
              </span>
              <span className="text-sm text-slate-500">
                {format(new Date(appt.date), "PP p")}
              </span>
            </div>
            <h3 className="font-semibold text-slate-900">{appt.patient.name}</h3>
            <p className="text-sm text-slate-600">{appt.reason || "No reason provided"}</p>
          </div>

          {appt.status === "PENDING" && (
            <div className="flex gap-2">
              <button
                onClick={() => handleStatusUpdate(appt.id, "CANCELLED")}
                className="px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition"
              >
                Reject
              </button>
              <button
                onClick={() => handleStatusUpdate(appt.id, "CONFIRMED")}
                className="px-3 py-1.5 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition"
              >
                Approve
              </button>
            </div>
          )}
          
          {appt.status === "CONFIRMED" && (
             <button
                onClick={() => handleStatusUpdate(appt.id, "COMPLETED")}
                className="px-3 py-1.5 text-sm font-medium text-sky-600 bg-sky-50 hover:bg-sky-100 rounded-lg transition"
              >
                Mark Complete
              </button>
          )}
        </div>
      ))}
    </div>
  );
}
