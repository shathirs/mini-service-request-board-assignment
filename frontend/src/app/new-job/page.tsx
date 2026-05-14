"use client";

import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/services/api";

function buildCreateJobBody(form: {
  title: string;
  description: string;
  category: string;
  location: string;
  contactName: string;
  contactEmail: string;
}) {
  const body: Record<string, string> = {
    title: form.title.trim(),
    description: form.description.trim(),
  };
  if (form.category.trim()) body.category = form.category.trim();
  if (form.location.trim()) body.location = form.location.trim();
  if (form.contactName.trim()) body.contactName = form.contactName.trim();
  if (form.contactEmail.trim()) body.contactEmail = form.contactEmail.trim();
  return body;
}

export default function NewJobPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    location: "",
    contactName: "",
    contactEmail: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.description.trim()) {
      alert("Title and description are required");
      return;
    }

    try {
      setLoading(true);
      await api.post("/jobs", buildCreateJobBody(formData));
      router.push("/");
    } catch (error) {
      console.error(error);
      const message = axios.isAxiosError(error)
        ? (error.response?.data as { message?: string } | undefined)?.message
        : undefined;
      alert(message ?? "Failed to create job");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 p-8">

      <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-md">

        <h1 className="text-3xl font-bold mb-6">Create New Job</h1>

        <form onSubmit={handleSubmit} className="space-y-5">

          <div>
            <label className="block mb-2 font-medium">Title *</label>
            <input type="text" name="title" value={formData.title} onChange={handleChange} className="w-full border p-3 rounded-lg" placeholder="Need a plumber"/>
          </div>

          <div>
            <label className="block mb-2 font-medium">Description *</label>
            <textarea name="description" value={formData.description} onChange={handleChange} className="w-full border p-3 rounded-lg h-32" placeholder="Describe the issue..."/>
          </div>

          <div>
            <label className="block mb-2 font-medium">Category</label>
            <select name="category" value={formData.category} onChange={handleChange} className="w-full border p-3 rounded-lg">
              <option value="">Select Category</option>
              <option value="Plumbing">Plumbing</option>
              <option value="Electrical">Electrical</option>
              <option value="Painting">Painting</option>
              <option value="Joinery">Joinery</option>
            </select>
          </div>

          <div>
            <label className="block mb-2 font-medium">Location</label>
            <input type="text" name="location" value={formData.location} onChange={handleChange} className="w-full border p-3 rounded-lg" placeholder="Glasgow"/>
          </div>

          <div>
            <label className="block mb-2 font-medium">Contact Name</label>
            <input type="text" name="contactName" value={formData.contactName} onChange={handleChange} className="w-full border p-3 rounded-lg" placeholder="John Doe"/>
          </div>

          <div>
            <label className="block mb-2 font-medium">Contact Email</label>
            <input type="email" name="contactEmail" value={formData.contactEmail} onChange={handleChange} className="w-full border p-3 rounded-lg" placeholder="john@example.com"/>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
            {loading ? "Creating..." : "Create Job"}
          </button>

        </form>

      </div>

    </main>
  );
}