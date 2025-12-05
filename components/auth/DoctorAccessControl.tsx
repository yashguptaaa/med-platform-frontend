"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export function DoctorAccessControl() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return;

    if (user && user.role === "DOCTOR") {
      // Allow access to /doctor routes
      if (!pathname.startsWith("/doctor")) {
        // Prevent infinite redirect if we are already trying to go there but something is wrong,
        // but generally redirecting to dashboard is safe.
        router.replace("/doctor/dashboard");
      }
    }
  }, [user, isLoading, pathname, router]);

  return null;
}
