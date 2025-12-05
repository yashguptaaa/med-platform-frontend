"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import Link from "next/link";
import { AppointmentsList } from "@/components/dashboard/AppointmentsList";

export default function DoctorDashboard() {
  const [stats, setStats] = useState({
    appointments: 0,
    rating: 0,
    experience: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/doctor/me");
        const profile = res.data.data;
        setStats({
          appointments: profile?.totalAppointments || 0,
          rating: profile?.rating || 0,
          experience: profile?.yearsOfExperience || 0,
        });
      } catch (error: any) {
        console.error("Failed to load profile:", error);
        if (error.response?.status === 401) {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("user");
          window.location.href = "/login?error=session_expired";
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) return <div>Loading dashboard...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-sm font-medium text-slate-500">Total Appointments</h3>
          <p className="text-3xl font-bold text-slate-900 mt-2">{stats.appointments}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-sm font-medium text-slate-500">Rating</h3>
          <p className="text-3xl font-bold text-slate-900 mt-2">{stats.rating.toFixed(1)}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-sm font-medium text-slate-500">Experience</h3>
          <p className="text-3xl font-bold text-slate-900 mt-2">{stats.experience} Years</p>
        </div>
      </div>



      <div className="space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Recent Appointments</h2>
        <AppointmentsList />
      </div>
    </div>
  );
}
