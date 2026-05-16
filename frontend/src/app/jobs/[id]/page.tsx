"use client";

import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import api from "@/services/api";
import StatusMessage from "@/components/StatusMessage";

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

type Feedback = {
  type: "success" | "error";
  message: string;
};

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.id as string;

  const [job, setJob] = useState<Job | null>(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  const showFeedback = useCallback((type: Feedback["type"], message: string) => {
    setFeedback({ type, message });
  }, []);

  useEffect(() => {
    if (!feedback) return;
    const timer = window.setTimeout(() => setFeedback(null), 5000);
    return () => window.clearTimeout(timer);
  }, [feedback]);

  const fetchJob = useCallback(async () => {
    try {
      const response = await api.get(`/jobs/${jobId}`);
      setJob(response.data);
      setStatus(response.data.status);
    } catch (error) {
      console.error(error);
      const message = axios.isAxiosError(error)
        ? (error.response?.data as { message?: string } | undefined)?.message
        : undefined;
      showFeedback("error", message ?? "Could not load this job. Please try again.");
    }
  }, [jobId, showFeedback]);

  useEffect(() => {
    void fetchJob();
  }, [fetchJob]);

  const updateStatus = async () => {
    if (status === job?.status) {
      showFeedback("error", "Please choose a different status before updating.");
      return;
    }

    setLoading(true);
    setFeedback(null);
    try {
      const response = await api.patch(`/jobs/${jobId}`, { status });
      setJob(response.data);
      setStatus(response.data.status);
      showFeedback(
        "success",
        `Status updated successfully. This job is now marked as "${response.data.status}".`
      );
    } catch (error) {
      console.error(error);
      const message = axios.isAxiosError(error)
        ? (error.response?.data as { message?: string } | undefined)?.message
        : undefined;
      showFeedback("error", message ?? "Could not update status. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const deleteJob = async () => {
    setDeleting(true);
    setFeedback(null);
    try {
      const response = await api.delete(`/jobs/${jobId}`);
      const apiMessage = (response.data as { message?: string } | undefined)?.message;
      showFeedback(
        "success",
        apiMessage ??
          `"${job?.title ?? "This job"}" was deleted successfully. Redirecting to the board…`
      );
      setShowDeleteConfirm(false);
      window.setTimeout(() => router.push("/"), 2000);
    } catch (error) {
      console.error(error);
      const message = axios.isAxiosError(error)
        ? (error.response?.data as { message?: string } | undefined)?.message
        : undefined;
      showFeedback("error", message ?? "Could not delete this job. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/"
          className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-blue-600 transition hover:text-blue-800"
        >
          <span aria-hidden>←</span>
          Back to Service Board
        </Link>

        {!job ? (
          <>
            {feedback && (
              <StatusMessage
                type={feedback.type}
                message={feedback.message}
                onDismiss={() => setFeedback(null)}
              />
            )}
            {!feedback && (
              <p className="text-center text-gray-600">Loading job details…</p>
            )}
          </>
        ) : (
        <div className="rounded-xl bg-white p-8 shadow-md">
        {feedback && (
          <StatusMessage
            type={feedback.type}
            message={feedback.message}
            onDismiss={() => setFeedback(null)}
          />
        )}

        <h1 className="text-4xl font-bold mb-4">{job.title}</h1>

        <div className="flex gap-4 mb-6">
          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded">
            {job.category}
          </span>
          <span className="bg-green-100 text-green-700 px-3 py-1 rounded">
            {job.status}
          </span>
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
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="border p-3 rounded-lg"
            >
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Closed">Closed</option>
            </select>
            <button
              onClick={updateStatus}
              disabled={loading}
              className="bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-60"
            >
              {loading ? "Updating…" : "Update"}
            </button>
          </div>
        </div>

        <div className="mt-10 border-t pt-6">
          {showDeleteConfirm ? (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4">
              <p className="mb-4 text-sm font-medium text-red-800">
                Are you sure you want to delete &quot;{job.title}&quot;? This action
                cannot be undone.
              </p>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={deleting}
                  className="rounded-lg border border-gray-300 bg-white px-5 py-2 font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-60"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={deleteJob}
                  disabled={deleting}
                  className="rounded-lg bg-red-600 px-5 py-2 font-semibold text-white transition hover:bg-red-700 disabled:opacity-60"
                >
                  {deleting ? "Deleting…" : "Yes, delete job"}
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => {
                setShowDeleteConfirm(true);
                setFeedback(null);
              }}
              className="rounded-lg bg-red-600 px-5 py-3 font-semibold text-white transition hover:bg-red-700"
            >
              Delete Job
            </button>
          )}
        </div>
        </div>
        )}
      </div>
    </main>
  );
}
