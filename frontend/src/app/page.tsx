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
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearch(search), 300);
    return () => window.clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    let cancelled = false;

    async function loadJobs() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (category) {
          params.set("category", category);
        }
        if (debouncedSearch.trim()) {
          params.set("search", debouncedSearch.trim());
        }
        const query = params.toString();
        const url = query ? `/jobs?${query}` : "/jobs";

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
  }, [category, debouncedSearch]);

  const clearSearch = () => {
    setSearch("");
    setDebouncedSearch("");
  };

  const hasActiveFilters = Boolean(category || debouncedSearch.trim());

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
        <div className="mb-6 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
            <div className="w-full sm:w-52">
              <label
                htmlFor="category-filter"
                className="mb-1.5 block text-sm font-medium text-gray-700"
              >
                Category
              </label>
              <select
                id="category-filter"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="">All Categories</option>
                <option value="Plumbing">Plumbing</option>
                <option value="Electrical">Electrical</option>
                <option value="Painting">Painting</option>
                <option value="Joinery">Joinery</option>
              </select>
            </div>

            <div className="min-w-0 flex-1">
              <label
                htmlFor="job-search"
                className="mb-1.5 block text-sm font-medium text-gray-700"
              >
                Search
              </label>
              <div className="relative">
                <span
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  aria-hidden
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="h-5 w-5"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
                <input
                  id="job-search"
                  type="text"
                  placeholder="Search by title or description…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-10 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
                {search && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
                    aria-label="Clear search"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="h-5 w-5"
                    >
                      <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>

          {hasActiveFilters && (
            <p className="mt-3 text-sm text-gray-500">
              {loading ? "Updating results…" : "Showing filtered results"}
              {debouncedSearch.trim() && (
                <span>
                  {" "}
                  for &quot;
                  <span className="font-medium text-gray-700">{debouncedSearch}</span>
                  &quot;
                </span>
              )}
            </p>
          )}
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
