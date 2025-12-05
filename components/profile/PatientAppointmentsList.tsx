"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { format } from "date-fns";
import { useAuth } from "@/context/AuthContext";
import { Modal } from "@/components/ui/Modal";

interface Appointment {
  id: string;
  date: string;
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
  reason: string;
  doctor: {
    name: string;
    specializations: { name: string }[];
  };
  hospital: {
    name: string;
    city: string;
  };
  review?: {
    rating: number;
    comment: string;
  };
  hasReviewedDoctor?: boolean;
}

export function PatientAppointmentsList() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  
  // Rating Modal State
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  const fetchAppointments = async () => {
    try {
      const res = await api.get("/appointments/me");
      setAppointments(res.data.data || []);
    } catch (error) {
      console.error("Failed to fetch appointments", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchAppointments();
    }
  }, [user]);

  const openRatingModal = (appointmentId: string) => {
    setSelectedAppointmentId(appointmentId);
    setRating(5);
    setComment("");
    setIsRatingModalOpen(true);
  };

  const handleSubmitReview = async () => {
    if (!selectedAppointmentId) return;
    
    setSubmittingReview(true);
    try {
      await api.post("/reviews", {
        appointmentId: selectedAppointmentId,
        rating,
        comment,
      });
      
      // Refresh list to show updated review status
      await fetchAppointments();
      setIsRatingModalOpen(false);
    } catch (error: any) {
      console.error("Failed to submit review", error);
      if (error.response?.status === 409) {
        alert("You have already reviewed this doctor. You cannot submit another review.");
      } else {
        alert("Failed to submit review. Please try again.");
      }
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) return <div className="text-slate-500">Loading appointments...</div>;

  if (!appointments?.length ) {
    return (
      <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-200">
        <p className="text-slate-500">You haven't booked any appointments yet.</p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-6 py-4 font-semibold">Doctor</th>
              <th className="px-6 py-4 font-semibold">Hospital</th>
              <th className="px-6 py-4 font-semibold">Date & Time</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {appointments.map((appt) => (
              <tr key={appt.id} className="hover:bg-slate-50 transition">
                <td className="px-6 py-4 font-medium text-slate-900">
                  Dr. {appt.doctor.name}
                </td>
                <td className="px-6 py-4">
                  {appt.hospital.name}
                  <span className="block text-xs text-slate-400">{appt.hospital.city}</span>
                </td>
                <td className="px-6 py-4">
                  {format(new Date(appt.date), "PP")}
                  <span className="block text-xs text-slate-400">{format(new Date(appt.date), "p")}</span>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    appt.status === "PENDING" ? "bg-amber-100 text-amber-700" :
                    appt.status === "CONFIRMED" ? "bg-emerald-100 text-emerald-700" :
                    appt.status === "CANCELLED" ? "bg-red-100 text-red-700" :
                    "bg-slate-100 text-slate-700"
                  }`}>
                    {appt.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {appt.status === "COMPLETED" ? (
                    appt.review ? (
                      <div className="flex items-center gap-1 text-amber-500">
                        <span className="font-bold">{appt.review.rating}</span>
                        <span>★</span>
                        <span className="text-xs text-slate-400 ml-1">Rated</span>
                      </div>
                    ) : appt.hasReviewedDoctor ? (
                      <span className="text-sm font-medium text-slate-400">
                        Reviewed
                      </span>
                    ) : (
                      <button
                        onClick={() => openRatingModal(appt.id)}
                        className="text-sm font-medium text-violet-600 hover:text-violet-700 hover:underline"
                      >
                        Rate Doctor
                      </button>
                    )
                  ) : (
                    <span className="text-slate-400 italic text-xs">--</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={isRatingModalOpen}
        onClose={() => setIsRatingModalOpen(false)}
        title="Rate Your Experience"
      >
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Rating
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className={`text-2xl transition ${
                    rating >= star ? "text-amber-400 scale-110" : "text-slate-200 hover:text-amber-200"
                  }`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Comment (Optional)
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full rounded-lg border-slate-200 text-sm focus:border-violet-500 focus:ring-violet-500"
              rows={3}
              placeholder="Share your experience..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => setIsRatingModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmitReview}
              disabled={submittingReview}
              className="px-4 py-2 text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 rounded-lg transition disabled:opacity-50"
            >
              {submittingReview ? "Submitting..." : "Submit Review"}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
