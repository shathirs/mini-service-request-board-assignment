"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Job } from "../components/jobCard";
import JobCard from "../components/jobCard";
import api from "../services/api";

export default function Home() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadJobs() {
      setLoading(true);
      try {
        let url = "/jobs";
        if (category) {
          url += `?category=${encodeURIComponent(category)}`;
        }
        const response = await api.get(url);
        if (!cancelled) {
          setJobs(response.data);
        }
      } catch (error) {
        console.log(error);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadJobs();

    return () => {
      cancelled = true;
    };
  }, [category]);

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-4xl font-bold">Service Request Board</h1>
          <Link
            href="/new-job"
            className="rounded-lg bg-blue-600 px-4 py-2 text-white"
          >
            + New Job
          </Link>
        </div>
        <div className="mb-6">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="rounded-lg border bg-white p-2"
          >
            <option value="">All Categories</option>
            <option value="Plumbing">Plumbing</option>
            <option value="Electrical">Electrical</option>
            <option value="Painting">Painting</option>
            <option value="Joinery">Joinery</option>
          </select>
        </div>

        {loading ? (
          <p className="text-gray-600">Loading jobs…</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {jobs.map((job, index) => (
              <JobCard key={job._id ?? `job-${index}`} job={job} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
