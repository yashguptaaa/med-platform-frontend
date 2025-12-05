"use client";

import { FormEvent, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000/api";

export function ContactForm() {
  const [status, setStatus] = useState<null | "success" | "error">(null);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus(null);
    setMessage("");

    if (!user) {
      setShowLoginModal(true);
      return;
    }

    const formData = new FormData(event.currentTarget);
    const name = formData.get("name")?.toString().trim() ?? "";
    const email = formData.get("email")?.toString().trim() ?? "";
    const body = formData.get("message")?.toString().trim() ?? "";

    if (!name || !email || !body) {
      setStatus("error");
      setMessage("Please complete all fields before submitting.");
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await fetch(`${API_BASE_URL}/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, message: body }),
      });

      if (!res.ok) {
        throw new Error("Failed to send message");
      }

      setStatus("success");
      setMessage("Thanks! A care coordinator will reply within one business day.");
      (event.target as HTMLFormElement).reset();
    } catch (error) {
      console.error(error);
      setStatus("error");
      setMessage("Something went wrong while sending your message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-3 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <label className="text-sm text-slate-500">
          Name
          <input
            name="name"
            defaultValue={user?.name || ""}
            className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm focus:border-sky-500 focus:outline-none"
            placeholder="Abby Rivers"
          />
        </label>
        <label className="text-sm text-slate-500">
          Email
          <input
            name="email"
            type="email"
            defaultValue={user?.email || ""}
            className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm focus:border-sky-500 focus:outline-none"
            placeholder="you@email.com"
          />
        </label>
        <label className="text-sm text-slate-500">
          Message
          <textarea
            name="message"
            rows={4}
            className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm focus:border-sky-500 focus:outline-none"
            placeholder="Tell us how we can help..."
          />
        </label>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-full bg-sky-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Sending..." : "Submit"}
        </button>
        {status && (
          <p
            aria-live="polite"
            className={`text-xs ${
              status === "success" ? "text-emerald-600" : "text-rose-600"
            }`}
          >
            {message}
          </p>
        )}
      </form>

      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-bold text-slate-900">
              Login Required
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              Please log in to contact support. This helps us track your request and respond faster.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShowLoginModal(false)}
                className="flex-1 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <Link
                href="/login"
                className="flex-1 rounded-full bg-sky-600 px-4 py-2 text-center text-sm font-semibold text-white hover:bg-sky-700"
              >
                Log in
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
