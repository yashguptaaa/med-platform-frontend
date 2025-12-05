"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      await api.post("/auth/forgot-password", { email });
      setStatus("success");
      setMessage("If your email is registered, you will receive a reset link shortly.");
    } catch (err: any) {
      setStatus("error");
      setMessage(err.response?.data?.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6 text-slate-800">
          Reset Password
        </h2>

        {status === "success" ? (
          <div className="text-center">
            <div className="bg-emerald-50 text-emerald-700 p-4 rounded-lg mb-6 text-sm">
              {message}
            </div>
            <Link href="/login" className="text-sky-600 font-medium hover:underline">
              Return to Login
            </Link>
          </div>
        ) : (
          <>
            <p className="text-slate-600 text-center mb-6 text-sm">
              Enter your email address and we'll send you a link to reset your password.
            </p>

            {status === "error" && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@email.com"
                />
              </div>

              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full bg-sky-600 text-white py-2 rounded-lg font-semibold hover:bg-sky-700 transition disabled:opacity-50"
              >
                {status === "loading" ? "Sending Link..." : "Send Reset Link"}
              </button>
            </form>

            <div className="mt-6 text-center">
              <Link href="/login" className="text-sm text-slate-500 hover:text-sky-600">
                ← Back to Login
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
