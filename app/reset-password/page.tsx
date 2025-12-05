"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Invalid or missing reset token.");
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setStatus("error");
      setMessage("Passwords do not match.");
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      await api.post("/auth/reset-password", { token, password });
      setStatus("success");
      setMessage("Password reset successfully! Redirecting to login...");
      setTimeout(() => router.push("/login"), 2000);
    } catch (err: any) {
      setStatus("error");
      setMessage(err.response?.data?.message || "Failed to reset password. Link may be expired.");
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg text-center">
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
            Invalid or missing reset token.
          </div>
          <Link href="/forgot-password" className="text-sky-600 font-medium hover:underline">
            Request a new link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6 text-slate-800">
          Set New Password
        </h2>

        {status === "success" && (
          <div className="bg-emerald-50 text-emerald-700 p-3 rounded-lg mb-4 text-sm">
            {message}
          </div>
        )}

        {status === "error" && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              New Password
            </label>
            <input
              type="password"
              required
              minLength={8}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min. 8 characters"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              required
              minLength={8}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter password"
            />
          </div>

          <button
            type="submit"
            disabled={status === "loading" || status === "success"}
            className="w-full bg-sky-600 text-white py-2 rounded-lg font-semibold hover:bg-sky-700 transition disabled:opacity-50"
          >
            {status === "loading" ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
