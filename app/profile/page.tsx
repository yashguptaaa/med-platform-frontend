"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { PatientAppointmentsList } from "@/components/profile/PatientAppointmentsList";

export default function ProfilePage() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-sky-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="mb-8 text-3xl font-bold text-slate-900">My Profile</h1>

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="bg-slate-50 px-8 py-6 border-b border-slate-200">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-sky-100 text-2xl font-bold text-sky-700 overflow-hidden">
              {user.image ? (
                <img src={user.image} alt={user.name} className="h-full w-full object-cover" />
              ) : (
                user.name.charAt(0).toUpperCase()
              )}
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">{user.name}</h2>
              <p className="text-slate-500">{user.email}</p>
            </div>
          </div>
        </div>

        <div className="p-8">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-slate-500">
                Full Name
              </label>
              <p className="mt-1 text-lg font-medium text-slate-900">
                {user.name}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-500">
                Email Address
              </label>
              <p className="mt-1 text-lg font-medium text-slate-900">
                {user.email}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-500">
                Account Role
              </label>
              <span
                className={`mt-2 inline-block rounded-full px-3 py-1 text-sm font-medium ${
                  user.role === "ADMIN"
                    ? "bg-purple-100 text-purple-700"
                    : "bg-emerald-100 text-emerald-700"
                }`}
              >
                {user.role}
              </span>
            </div>
          </div>



          <div className="mt-10 border-t border-slate-100 pt-8">
            <h2 className="text-xl font-bold text-slate-900 mb-6">My Appointments</h2>
            <PatientAppointmentsList />
          </div>

          <div className="mt-10 border-t border-slate-100 pt-6">
            <button
              onClick={logout}
              className="rounded-full border border-rose-200 bg-rose-50 px-6 py-2 text-sm font-semibold text-rose-600 transition hover:bg-rose-100"
            >
              Log Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
