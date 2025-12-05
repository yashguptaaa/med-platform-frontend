"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default function DoctorSchedulePage() {
  const [availability, setAvailability] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/doctor/me");
        setAvailability(res.data.availability || []);
      } catch (error) {
        console.error("Failed to load schedule");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put("/doctor/availability", { availability });
      alert("Schedule updated successfully");
    } catch (error) {
      alert("Failed to update schedule");
    } finally {
      setSaving(false);
    }
  };

  const addSlot = (dayIndex: number) => {
    setAvailability([...availability, { dayOfWeek: dayIndex, startTime: "09:00", endTime: "17:00" }]);
  };

  const removeSlot = (index: number) => {
    setAvailability(availability.filter((_, i) => i !== index));
  };

  const updateSlot = (index: number, field: string, value: string) => {
    const newAvailability = [...availability];
    newAvailability[index] = { ...newAvailability[index], [field]: value };
    setAvailability(newAvailability);
  };

  if (loading) return <div>Loading schedule...</div>;

  return (
    <div className="max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Weekly Schedule</h1>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      <div className="space-y-6">
        {DAYS.map((day, dayIndex) => {
          const slots = availability.filter((a) => a.dayOfWeek === dayIndex);
          
          return (
            <div key={day} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-slate-800">{day}</h3>
                <button
                  onClick={() => addSlot(dayIndex)}
                  className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                >
                  + Add Slot
                </button>
              </div>

              {slots.length === 0 ? (
                <p className="text-sm text-slate-400 italic">No availability set</p>
              ) : (
                <div className="space-y-3">
                  {slots.map((slot, i) => {
                    // Find the actual index in the main array to update/remove
                    const realIndex = availability.indexOf(slot);
                    return (
                      <div key={i} className="flex items-center gap-4">
                        <input
                          type="time"
                          value={slot.startTime}
                          onChange={(e) => updateSlot(realIndex, "startTime", e.target.value)}
                          className="px-3 py-2 border border-slate-200 rounded-lg text-sm"
                        />
                        <span className="text-slate-400">to</span>
                        <input
                          type="time"
                          value={slot.endTime}
                          onChange={(e) => updateSlot(realIndex, "endTime", e.target.value)}
                          className="px-3 py-2 border border-slate-200 rounded-lg text-sm"
                        />
                        <button
                          onClick={() => removeSlot(realIndex)}
                          className="text-red-500 hover:text-red-700 text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
