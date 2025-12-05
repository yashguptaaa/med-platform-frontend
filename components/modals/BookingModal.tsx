"use client";

import { useState, useEffect } from "react";
import { format, addDays, startOfToday } from "date-fns";
import { Modal } from "@/components/ui/Modal";
import { api } from "@/lib/api";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  doctorId: string;
  doctorName: string;
  hospitalId: string; // We might need to let user select hospital if doctor has multiple
}

export function BookingModal({ isOpen, onClose, doctorId, doctorName, hospitalId }: BookingModalProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(startOfToday());
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [booking, setBooking] = useState(false);

  // Generate next 7 days
  const dates = Array.from({ length: 7 }, (_, i) => addDays(startOfToday(), i));

  useEffect(() => {
    if (isOpen && doctorId) {
      fetchSlots();
    }
  }, [isOpen, selectedDate, doctorId]);

  const fetchSlots = async () => {
    setLoading(true);
    setAvailableSlots([]);
    setSelectedSlot(null);
    try {
      const dateStr = format(selectedDate, "yyyy-MM-dd");
      const res = await api.get(`/appointments/slots?doctorId=${doctorId}&date=${dateStr}`);
      setAvailableSlots(res.data.data);
    } catch (error) {
      console.error("Failed to fetch slots", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBook = async () => {
    if (!selectedSlot) return;
    
    setBooking(true);
    try {
      // Construct full date object from selected date + slot time
      const [hours, minutes] = selectedSlot.split(":").map(Number);
      const appointmentDate = new Date(selectedDate);
      appointmentDate.setHours(hours, minutes, 0, 0);

      await api.post("/appointments", {
        doctorId,
        hospitalId,
        date: appointmentDate.toISOString(),
        reason,
      });

      alert("Appointment requested successfully! Check your email for confirmation.");
      onClose();
    } catch (error: any) {
      console.error("Booking failed", error);
      alert(error.response?.data?.message || "Failed to book appointment");
    } finally {
      setBooking(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Book with ${doctorName}`}>
      <div className="space-y-6">
        {/* Date Selection */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Select Date</label>
          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
            {dates.map((date) => {
              const isSelected = format(date, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd");
              return (
                <button
                  key={date.toString()}
                  onClick={() => setSelectedDate(date)}
                  className={`flex-shrink-0 flex flex-col items-center justify-center w-16 h-20 rounded-xl border transition ${
                    isSelected
                      ? "bg-sky-600 border-sky-600 text-white"
                      : "bg-white border-slate-200 text-slate-600 hover:border-sky-300"
                  }`}
                >
                  <span className="text-xs font-medium">{format(date, "EEE")}</span>
                  <span className="text-lg font-bold">{format(date, "d")}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Slot Selection */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Available Slots</label>
          {loading ? (
            <div className="text-center py-8 text-slate-400 text-sm">Loading slots...</div>
          ) : availableSlots.length > 0 ? (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {availableSlots.map((slot) => (
                <button
                  key={slot}
                  onClick={() => setSelectedSlot(slot)}
                  className={`py-2 px-3 rounded-lg text-sm font-medium transition ${
                    selectedSlot === slot
                      ? "bg-sky-100 text-sky-700 border-2 border-sky-500"
                      : "bg-slate-50 text-slate-600 border border-slate-200 hover:border-sky-300"
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-slate-400 text-sm bg-slate-50 rounded-xl border border-dashed border-slate-200">
              No slots available for this date.
            </div>
          )}
        </div>

        {/* Reason */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Reason for Visit</label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Briefly describe your symptoms or reason for visit..."
            className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 outline-none text-sm h-24 resize-none"
          />
        </div>

        {/* Actions */}
        <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-full text-sm font-medium text-slate-600 hover:bg-slate-100 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleBook}
            disabled={!selectedSlot || booking}
            className="px-6 py-2 rounded-full text-sm font-bold text-white bg-sky-600 hover:bg-sky-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {booking ? "Booking..." : "Confirm Booking"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
