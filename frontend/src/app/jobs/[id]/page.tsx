"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import API from "@/services/api";

interface Job {
  _id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  contactName: string;
  contactEmail: string;
  status: string;
  createdAt: string;
}

export default function JobDetailPage() {

  const params = useParams();
  const router = useRouter();

  const [job, setJob] = useState<Job | null>(null);

  const [status, setStatus] = useState("");

  const [loading, setLoading] = useState(false);

  const fetchJob = async () => {
    try {
      const response = await API.get(`/jobs/${params.id}`);
      setJob(response.data);
      setStatus(response.data.status);
    } catch (error) {
      console.log(error);
      alert("Failed to load job");
    }
  };

  useEffect(() => {fetchJob();}, []);

  const updateStatus = async () => {
    try {
      setLoading(true);
      const response = await API.patch(`/jobs/${params.id}`, {
        status,
      });
      setJob(response.data);
      alert("Status updated");
    } catch (error) {
      console.log(error);
      alert("Failed to update status");
    } finally {
      setLoading(false);
    }
  };

  const deleteJob = async () => {
    const confirmDelete = confirm("Are you sure you want to delete this job?");
    if (!confirmDelete) return;
    try {
      await API.delete(`/jobs/${params.id}`);
      alert("Job deleted");
      router.push("/");
    } catch (error) {
      console.log(error);
      alert("Failed to delete job");
    }
  };

  if (!job) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 p-8">

      <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-md">

        <h1 className="text-4xl font-bold mb-4">
          {job.title}
        </h1>

        <div className="flex gap-4 mb-6">

          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded">{job.category}</span>

          <span className="bg-green-100 text-green-700 px-3 py-1 rounded">{job.status}</span>

        </div>

        <p className="text-gray-700 mb-6 whitespace-pre-line">{job.description}</p>

        <div className="space-y-2 mb-8">

          <p>
            <strong>Location:</strong> {job.location}
          </p>

          <p>
            <strong>Contact Name:</strong> {job.contactName}
          </p>

          <p>
            <strong>Contact Email:</strong> {job.contactEmail}
          </p>

        </div>

        <div className="border-t pt-6">

          <h2 className="text-xl font-semibold mb-4">Update Status</h2>

          <div className="flex gap-4">

            <select value={status} onChange={(e) => setStatus(e.target.value)} className="border p-3 rounded-lg">
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Closed">Closed</option>
            </select>

            <button onClick={updateStatus} disabled={loading} className="bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700 transition">
              {loading ? "Updating..." : "Update"}
            </button>

          </div>

        </div>

        <div className="mt-10 border-t pt-6">

          <button onClick={deleteJob} className="bg-red-600 text-white px-5 py-3 rounded-lg hover:bg-red-700 transition">Delete Job</button>

        </div>

      </div>

    </main>
  );
}