"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";

interface Specialization {
  id: string;
  name: string;
}

export default function CreateHospitalPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [specs, setSpecs] = useState<Specialization[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    city: "",
    address: "",
    latitude: "",
    longitude: "",
    googleMapLink: "",
    specializationIds: [] as string[],
  });

  useEffect(() => {
    api.get("/specializations").then((res) => {
      setSpecs(res.data.data);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("city", formData.city);
      data.append("address", formData.address);
      if (formData.latitude) data.append("latitude", formData.latitude);
      if (formData.longitude) data.append("longitude", formData.longitude);
      if (formData.googleMapLink) data.append("googleMapLink", formData.googleMapLink);
      
      formData.specializationIds.forEach((id) => {
        data.append("specializationIds[]", id);
      });

      if (selectedFiles) {
        Array.from(selectedFiles).forEach((file) => {
          data.append("images", file);
        });
      }

      await api.post("/hospitals", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      router.push("/admin/hospitals");
    } catch (error) {
      console.error(error);
      alert("Failed to create hospital");
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

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Add New Hospital</h1>
      
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Hospital Name
          </label>
          <input
            type="text"
            required
            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Address
            </label>
            <input
              type="text"
              required
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Hospital Images
          </label>
          <input
            type="file"
            multiple
            accept="image/*"
            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            onChange={(e) => setSelectedFiles(e.target.files)}
          />
          <p className="mt-1 text-xs text-slate-500">
            Upload up to 5 images (JPG, PNG)
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Latitude (Optional)
            </label>
            <input
              type="number"
              step="any"
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.latitude}
              onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
              placeholder="e.g. 40.7128"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Longitude (Optional)
            </label>
            <input
              type="number"
              step="any"
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.longitude}
              onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
              placeholder="e.g. -74.0060"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Google Map Embed Link (Optional)
          </label>
          <input
            type="text"
            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            value={formData.googleMapLink}
            onChange={(e) => setFormData({ ...formData, googleMapLink: e.target.value })}
            placeholder="Paste the src URL from the iframe embed code"
          />
          <p className="mt-1 text-xs text-slate-500">
            Example: https://www.google.com/maps/embed?pb=...
          </p>
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
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-slate-700">{spec.name}</span>
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
            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Hospital"}
          </button>
        </div>
      </form>
    </div>
  );
}
