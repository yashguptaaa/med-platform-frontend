"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

interface Specialization {
  id: string;
  name: string;
  description?: string;
}

export default function AdminSpecializationsPage() {
  const [specs, setSpecs] = useState<Specialization[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [newSpec, setNewSpec] = useState({ name: "", description: "" });

  const fetchSpecs = async () => {
    try {
      const res = await api.get("/specializations");
      setSpecs(res.data.data);
    } catch (error) {
      console.error("Failed to fetch specializations", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSpecs();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post("/specializations", newSpec);
      setSpecs([...specs, res.data.data]);
      setIsCreating(false);
      setNewSpec({ name: "", description: "" });
    } catch (error) {
      alert("Failed to create specialization");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this specialization?")) return;
    try {
      await api.delete(`/specializations/${id}`);
      setSpecs((prev) => prev.filter((s) => s.id !== id));
    } catch (error) {
      alert("Failed to delete specialization");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Specializations</h1>
        <button
          onClick={() => setIsCreating(true)}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition font-medium"
        >
          Add Specialization
        </button>
      </div>

      {isCreating && (
        <div className="mb-6 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">New Specialization</h2>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
              <input
                type="text"
                required
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                value={newSpec.name}
                onChange={(e) => setNewSpec({ ...newSpec, name: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
              <textarea
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                value={newSpec.description}
                onChange={(e) => setNewSpec({ ...newSpec, description: e.target.value })}
              />
            </div>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg font-medium transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition"
              >
                Create
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 font-semibold text-slate-700">Name</th>
              <th className="px-6 py-4 font-semibold text-slate-700">Description</th>
              <th className="px-6 py-4 font-semibold text-slate-700 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {specs.map((spec) => (
              <tr key={spec.id} className="hover:bg-slate-50 transition">
                <td className="px-6 py-4 font-medium text-slate-900">{spec.name}</td>
                <td className="px-6 py-4 text-slate-600">{spec.description || "-"}</td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button
                    onClick={() => handleDelete(spec.id)}
                    className="text-red-600 hover:text-red-800 font-medium"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {specs.length === 0 && (
              <tr>
                <td colSpan={3} className="px-6 py-8 text-center text-slate-500">
                  No specializations found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
