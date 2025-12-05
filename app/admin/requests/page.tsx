"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function AdminRequestsPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      const res = await api.get("/doctors/requests");
      setRequests(res.data.data);
    } catch (error: any) {
      console.error("Failed to load requests", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleProcess = async (id: string, status: "APPROVED" | "REJECTED") => {
    try {
      await api.post(`/doctors/requests/${id}/process`, { status });
      fetchRequests(); // Refresh list
    } catch (error) {
      alert("Failed to process request");
    }
  };

  if (loading) return <div>Loading requests...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Doctor Change Requests</h1>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 font-semibold text-slate-700">Doctor</th>
              <th className="px-6 py-4 font-semibold text-slate-700">Requested Changes</th>
              <th className="px-6 py-4 font-semibold text-slate-700">Date</th>
              <th className="px-6 py-4 font-semibold text-slate-700 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {requests.map((req) => (
              <tr key={req.id} className="hover:bg-slate-50 transition">
                <td className="px-6 py-4 font-medium text-slate-900">
                  {req.doctor.name}
                </td>
                <td className="px-6 py-4 text-slate-600">
                  <pre className="whitespace-pre-wrap font-mono text-xs bg-slate-50 p-2 rounded border border-slate-100 max-w-md overflow-auto">
                    {JSON.stringify(req.requestedChanges, null, 2)}
                  </pre>
                </td>
                <td className="px-6 py-4 text-slate-600">
                  {new Date(req.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button
                    onClick={() => handleProcess(req.id, "APPROVED")}
                    className="text-green-600 hover:text-green-800 font-medium"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleProcess(req.id, "REJECTED")}
                    className="text-red-600 hover:text-red-800 font-medium"
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
            {requests.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                  No pending requests.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
