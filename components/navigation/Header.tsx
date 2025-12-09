"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

const PUBLIC_LINKS = [
  { href: "/", label: "Home" },
  { href: "/doctors", label: "Doctors" },
  { href: "/hospitals", label: "Hospitals" },
  { href: "/about", label: "About" },
  // { href: "/careers", label: "Careers" },
  { href: "/help", label: "Help / Contact" },
];

const ADMIN_LINKS = [
  { href: "/admin", label: "Admin Dashboard" },
];

const DOCTOR_LINKS = [
  { href: "/doctor/dashboard", label: "Dashboard" },
  { href: "/doctor/profile", label: "My Profile" },
];

export function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  // Determine which links to show based on user role
  let links = PUBLIC_LINKS;
  if (user?.role === "ADMIN") {
    links = ADMIN_LINKS;
  } else if (user?.role === "DOCTOR") {
    links = DOCTOR_LINKS;
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/50 bg-white/70 backdrop-blur-md supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-xl font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
          MedLink
        </Link>
        <button
          className="rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-600 md:hidden"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Toggle navigation"
        >
          Menu
        </button>
        <nav
          className={`${
            menuOpen ? "flex" : "hidden"
          } absolute left-0 top-full w-full flex-col gap-2 border-t border-slate-100 bg-white px-4 py-4 shadow-lg md:static md:flex md:w-auto md:flex-row md:items-center md:border-none md:bg-transparent md:px-0 md:py-0 md:shadow-none`}
        >
          {links.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
                  active
                    ? "bg-violet-50 text-violet-700 shadow-sm ring-1 ring-violet-200"
                    : "text-slate-600 hover:bg-white hover:text-violet-600 hover:shadow-sm"
                }`}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            );
          })}
          <div className="hidden md:block md:mx-2 md:h-6 md:w-px md:bg-slate-200" />
          
          {user ? (
            <>
              {user.role !== "DOCTOR" && (
                <Link
                  href="/profile"
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
                    pathname === "/profile"
                      ? "bg-violet-50 text-violet-700 shadow-sm ring-1 ring-violet-200"
                      : "text-slate-600 hover:bg-white hover:text-violet-600 hover:shadow-sm"
                  }`}
                  onClick={() => setMenuOpen(false)}
                >
                  Profile
                </Link>
              )}
              <button
                onClick={() => {
                  logout();
                  setMenuOpen(false);
                }}
                className="rounded-full px-4 py-2 text-sm font-medium text-slate-600 transition-all duration-200 hover:bg-rose-50 hover:text-rose-600"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
                pathname === "/login"
                  ? "bg-violet-600 text-white shadow-md shadow-violet-500/20 hover:bg-violet-700 hover:shadow-lg hover:shadow-violet-500/30"
                  : "text-slate-600 hover:bg-white hover:text-violet-600 hover:shadow-sm"
              }`}
              onClick={() => setMenuOpen(false)}
            >
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
