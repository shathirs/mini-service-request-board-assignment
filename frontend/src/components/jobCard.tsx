import Link from "next/link";

export type Job = {
  _id?: string;
  title: string;
  description: string;
  category?: string;
  location?: string;
  contactName?: string;
  contactEmail?: string;
  status?: "Open" | "In Progress" | "Closed";
  createdAt?: string;
};

type JobCardProps = {
  job: Job;
};

export default function JobCard({ job }: JobCardProps) {
  return (
    <div className="rounded-lg border bg-white p-4 shadow-md">
      <h2 className="mb-2 text-xl font-bold">{job.title}</h2>
      <p className="mb-2 text-gray-600">{job.description}</p>
      <div className="flex justify-between mb-3">
        <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-sm font-medium">{job.category}</span>
        <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-sm font-medium">{job.status}</span>
      </div>
      <p className="text-sm text-gray-500 mb-3">{job.location}</p>
      <link href={`/jobs/$(job._id)`} className="text-blue-600 font-semibold">View Details →</link>
    </div>
  );
}
