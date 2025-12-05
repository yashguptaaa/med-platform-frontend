"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { BookingModal } from "@/components/modals/BookingModal";
import { Modal } from "@/components/ui/Modal";

interface BookAppointmentButtonProps {
  doctorId: string;
  doctorName: string;
  hospitalId: string;
}

export function BookAppointmentButton({ doctorId, doctorName, hospitalId }: BookAppointmentButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  const handleBookClick = () => {
    if (!user) {
      setShowLoginPrompt(true);
      return;
    }
    setIsModalOpen(true);
  };

  const handleLoginRedirect = () => {
    router.push("/login?error=login_required&redirect=/doctors/" + doctorId);
  };

  return (
    <>
      <button
        onClick={handleBookClick}
        className="mt-6 block w-full rounded-full bg-white px-4 py-3 text-center font-bold text-sky-600 transition hover:bg-sky-50"
      >
        Request Booking
      </button>

      <BookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        doctorId={doctorId}
        doctorName={doctorName}
        hospitalId={hospitalId}
      />

      <Modal
        isOpen={showLoginPrompt}
        onClose={() => setShowLoginPrompt(false)}
        title="Login Required"
      >
        <div className="space-y-6">
          <p className="text-slate-600">
            You need to be logged in to book an appointment with Dr. {doctorName}.
          </p>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setShowLoginPrompt(false)}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition"
            >
              Cancel
            </button>
            <button
              onClick={handleLoginRedirect}
              className="px-4 py-2 text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 rounded-lg transition"
            >
              Login to Continue
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
