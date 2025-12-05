"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function DoctorProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [requesting, setRequesting] = useState(false);
  const [changeRequest, setChangeRequest] = useState({
    about: "",
    yearsOfExperience: 0,
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/doctor/me");
        const profileData = res.data.data;
        console.log("Profile Data:", profileData); // Debugging image issue
        setProfile(profileData);
        setChangeRequest({
          about: profileData?.about || "",
          yearsOfExperience: profileData?.yearsOfExperience || 0,
        });
      } catch (error: any) {
        console.error("Failed to load profile:", error);
        if (error.response?.status === 401) {
          // Clear stale token and redirect
          localStorage.removeItem("accessToken");
          localStorage.removeItem("user");
          window.location.href = "/login?error=session_expired";
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleRequestChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setRequesting(true);
    try {
      await api.post("/doctor/profile-update-request", {
        changes: changeRequest,
      });
      alert("Change request submitted for approval.");
    } catch (error) {
      alert("Failed to submit request");
    } finally {
      setRequesting(false);
    }
  };

  if (loading) return <div>Loading profile...</div>;
  if (!profile) return <div className="text-red-500">Failed to load profile. Please try again later.</div>;

  const pendingRequest = profile?.changeRequests?.[0];

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">My Profile</h1>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-slate-200 flex items-center justify-center text-2xl font-bold text-slate-500">
            {profile.image ? (
              <img
                src={profile.image}
                alt={profile.name}
                className="h-full w-full rounded-full object-cover"
              />
            ) : (
              profile.name.charAt(0)
            )}
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">{profile.name}</h2>
            <p className="text-slate-500">{profile.specializations.map((s: any) => s.name).join(", ")}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 text-sm">
          <div>
            <span className="block text-slate-500 mb-1">City</span>
            <span className="font-medium text-slate-900">{profile.city}</span>
          </div>
          <div>
            <span className="block text-slate-500 mb-1">Experience</span>
            <span className="font-medium text-slate-900">{profile.yearsOfExperience} Years</span>
          </div>
          <div className="col-span-2">
            <span className="block text-slate-500 mb-1">Hospitals</span>
            <div className="flex flex-wrap gap-2">
              {profile.hospitals.map((h: any) => (
                <span key={h.id} className="px-2 py-1 bg-slate-100 rounded text-slate-700">
                  {h.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Request Profile Update</h3>
        
        {pendingRequest && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-100 rounded-lg text-sm text-yellow-800">
            <strong>Pending Request:</strong> You have a pending change request submitted on {new Date(pendingRequest.createdAt).toLocaleDateString()}.
          </div>
        )}

        <form onSubmit={handleRequestChange} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Years of Experience
            </label>
            <input
              type="number"
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
              value={changeRequest.yearsOfExperience}
              onChange={(e) => setChangeRequest({ ...changeRequest, yearsOfExperience: parseInt(e.target.value) })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              About / Bio (Optional)
            </label>
            <textarea
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none h-32"
              value={changeRequest.about}
              onChange={(e) => setChangeRequest({ ...changeRequest, about: e.target.value })}
              placeholder="Tell patients about yourself..."
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={requesting}
              className="px-6 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition disabled:opacity-50"
            >
              {requesting ? "Submitting..." : "Submit Request"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
