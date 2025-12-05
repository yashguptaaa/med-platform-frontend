"use client";

import { useState, useEffect, use } from "react";
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

export default function EditDoctorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [specs, setSpecs] = useState<Specialization[]>([]);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  
  const [image, setImage] = useState<File | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    city: "",
    yearsOfExperience: 0,
    specializationIds: [] as string[],
    hospitalIds: [] as string[],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [specsRes, hospitalsRes, doctorRes] = await Promise.all([
          api.get("/specializations"),
          api.get("/hospitals"),
          api.get(`/doctors/${id}`),
        ]);
        
        setSpecs(specsRes.data.data);
        setHospitals(hospitalsRes.data.data);
        
        const doctor = doctorRes.data.data;
        setFormData({
          name: doctor.name,
          city: doctor.city,
          yearsOfExperience: doctor.yearsOfExperience,
          specializationIds: doctor.specializations.map((s: Specialization) => s.id),
          hospitalIds: doctor.hospitals.map((h: Hospital) => h.id),
        });
      } catch (error) {
        alert("Failed to load doctor details");
        router.push("/admin/doctors");
      } finally {
        setFetching(false);
      }
    };

    fetchData();
  }, [id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("city", formData.city);
      data.append("yearsOfExperience", formData.yearsOfExperience.toString());
      formData.specializationIds.forEach((id) => data.append("specializationIds[]", id));
      formData.hospitalIds.forEach((id) => data.append("hospitalIds[]", id));
      if (image) {
        data.append("image", image);
      }

      await api.put(`/doctors/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      router.push("/admin/doctors");
    } catch (error) {
      alert("Failed to update doctor");
    } finally {
      setLoading(false);
    }
  };

  const toggleSpec = (specId: string) => {
    setFormData((prev) => {
      const exists = prev.specializationIds.includes(specId);
      if (exists) {
        return {
          ...prev,
          specializationIds: prev.specializationIds.filter((sid) => sid !== specId),
        };
      } else {
        return {
          ...prev,
          specializationIds: [...prev.specializationIds, specId],
        };
      }
    });
  };

  const toggleHospital = (hospitalId: string) => {
    setFormData((prev) => {
      const exists = prev.hospitalIds.includes(hospitalId);
      if (exists) {
        return {
          ...prev,
          hospitalIds: prev.hospitalIds.filter((hid) => hid !== hospitalId),
        };
      } else {
        return {
          ...prev,
          hospitalIds: [...prev.hospitalIds, hospitalId],
        };
      }
    });
  };

  if (fetching) {
    return <div className="p-8 text-center text-slate-500">Loading doctor details...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Edit Doctor</h1>
      
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
            {loading ? "Updating..." : "Update Doctor"}
          </button>
        </div>
      </form>
    </div>
  );
}
