"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import Link from "next/link";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    hospitals: 0,
    doctors: 0,
    specializations: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [hospitalsRes, doctorsRes, specsRes] = await Promise.all([
          api.get("/hospitals"),
          api.get("/doctors"),
          api.get("/specializations"),
        ]);
        setStats({
          hospitals: hospitalsRes.data.data.length,
          doctors: doctorsRes.data.data.length,
          specializations: specsRes.data.data.length,
        });
      } catch (error) {
        console.error("Failed to fetch stats", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <div>Loading stats...</div>;
  }

  const cards = [
    {
      label: "Total Hospitals",
      value: stats.hospitals,
      href: "/admin/hospitals",
      color: "bg-blue-500",
    },
    {
      label: "Total Doctors",
      value: stats.doctors,
      href: "/admin/doctors",
      color: "bg-emerald-500",
    },
    {
      label: "Specializations",
      value: stats.specializations,
      href: "/admin/specializations",
      color: "bg-purple-500",
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="block bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">{card.label}</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">
                  {card.value}
                </p>
              </div>
              <div className={`w-12 h-12 rounded-lg ${card.color} opacity-10`} />
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-8 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">
          Quick Actions
        </h2>
        <div className="flex gap-4">
          <Link
            href="/admin/hospitals/create"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
          >
            Add Hospital
          </Link>
          <Link
            href="/admin/doctors/create"
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition text-sm font-medium"
          >
            Add Doctor
          </Link>
        </div>
      </div>
    </div>
  );
}
