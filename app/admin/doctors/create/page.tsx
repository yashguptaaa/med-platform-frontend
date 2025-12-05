"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";

interface Specialization {
  id: string;
  name: string;
}

interface Hospital {
  id: string;
  name: string;
}

export default function CreateDoctorPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [specs, setSpecs] = useState<Specialization[]>([]);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  
  const [image, setImage] = useState<File | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    city: "",
    yearsOfExperience: 0,
    specializationIds: [] as string[],
    hospitalIds: [] as string[],
  });

  useEffect(() => {
    Promise.all([
      api.get("/specializations"),
      api.get("/hospitals"),
    ]).then(([specsRes, hospitalsRes]) => {
      setSpecs(specsRes.data.data);
      setHospitals(hospitalsRes.data.data);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("email", formData.email);
      data.append("city", formData.city);
      data.append("yearsOfExperience", formData.yearsOfExperience.toString());
      formData.specializationIds.forEach((id) => data.append("specializationIds[]", id));
      formData.hospitalIds.forEach((id) => data.append("hospitalIds[]", id));
      if (image) {
        data.append("image", image);
      }

      await api.post("/doctors", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      router.push("/admin/doctors");
    } catch (error) {
      alert("Failed to create doctor");
    } finally {
      setLoading(false);
    }
  };

  const toggleSpec = (id: string) => {
    setFormData((prev) => {
      const exists = prev.specializationIds.includes(id);
      if (exists) {
        return {
          ...prev,
          specializationIds: prev.specializationIds.filter((sid) => sid !== id),
        };
      } else {
        return {
          ...prev,
          specializationIds: [...prev.specializationIds, id],
        };
      }
    });
  };

  const toggleHospital = (id: string) => {
    setFormData((prev) => {
      const exists = prev.hospitalIds.includes(id);
      if (exists) {
        return {
          ...prev,
          hospitalIds: prev.hospitalIds.filter((hid) => hid !== id),
        };
      } else {
        return {
          ...prev,
          hospitalIds: [...prev.hospitalIds, id],
        };
      }
    });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Add New Doctor</h1>
      
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Doctor Name
          </label>
          <input
            type="text"
            required
            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Profile Picture (Optional)
          </label>
          <input
            type="file"
            accept="image/*"
            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
            onChange={(e) => setImage(e.target.files?.[0] || null)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Email Address
          </label>
          <input
            type="email"
            required
            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <p className="text-xs text-slate-500 mt-1">Default password will be: password123!</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              City
            </label>
            <input
              type="text"
              required
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Experience (Years)
            </label>
            <input
              type="number"
              required
              min="0"
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
              value={formData.yearsOfExperience}
              onChange={(e) => setFormData({ ...formData, yearsOfExperience: parseInt(e.target.value) })}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Specializations
          </label>
          <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto p-2 border border-slate-100 rounded-lg">
            {specs.map((spec) => (
              <label key={spec.id} className="flex items-center space-x-2 cursor-pointer p-1 hover:bg-slate-50 rounded">
                <input
                  type="checkbox"
                  checked={formData.specializationIds.includes(spec.id)}
                  onChange={() => toggleSpec(spec.id)}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-sm text-slate-700">{spec.name}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Hospitals
          </label>
          <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto p-2 border border-slate-100 rounded-lg">
            {hospitals.map((hospital) => (
              <label key={hospital.id} className="flex items-center space-x-2 cursor-pointer p-1 hover:bg-slate-50 rounded">
                <input
                  type="checkbox"
                  checked={formData.hospitalIds.includes(hospital.id)}
                  onChange={() => toggleHospital(hospital.id)}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-sm text-slate-700">{hospital.name}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg font-medium transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Doctor"}
          </button>
        </div>
      </form>
    </div>
  );
}
