"use client";

import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DoctorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading) {
      console.log("!!!!!!!!!!DoctorLayout Check:", { user, role: user?.role });
    //   if (!user || ((user.role as string) !== "DOCTOR" && (user.role as string) !== "doctor")) {
    //     console.log("Redirecting to login from DoctorLayout");
    //     router.push("/login");
    //   }
    }
  }, [user, isLoading, router]);

  if (isLoading || !user || ((user.role as string) !== "DOCTOR" && (user.role as string) !== "doctor")) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  const navItems = [
    { label: "Dashboard", href: "/doctor/dashboard" },
    { label: "My Profile", href: "/doctor/profile" },
    { label: "Appointments", href: "/doctor/appointments" },
    { label: "Schedule", href: "/doctor/schedule" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 fixed h-full z-10">
        <div className="p-6 border-b border-slate-100">
          <h1 className="text-xl font-bold text-slate-800">Doctor Portal</h1>
          <p className="text-xs text-slate-500 mt-1">MedLink Platform</p>
        </div>
        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`block px-4 py-2 rounded-lg text-sm font-medium transition ${
                  isActive
                    ? "bg-emerald-50 text-emerald-700"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="absolute bottom-0 w-full p-4 border-t border-slate-100">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-xs">
              {user.name.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-slate-900 truncate">
                {user.name}
              </p>
              <p className="text-xs text-slate-500 truncate">{user.email}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition"
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        <div className="max-w-5xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
