"use client";

import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/services/api";
import StatusMessage from "@/components/StatusMessage";

type Feedback = {
  type: "success" | "error";
  message: string;
};

export default function RegistrationPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      setFeedback({
        type: "error",
        message: "Email and password are required.",
      });
      return;
    }

    if (password !== confirmPassword) {
      setFeedback({
        type: "error",
        message: "Passwords do not match.",
      });
      return;
    }

    setLoading(true);
    setFeedback(null);
    try {
      const response = await api.post("/auth/register", {
        email: email.trim(),
        password,
      });

      const apiMessage = (response.data as { message?: string } | undefined)
        ?.message;

      setFeedback({
        type: "success",
        message:
          apiMessage ??
          "Registration successful. Redirecting to login…",
      });

      window.setTimeout(() => router.push("/login"), 2000);
    } catch (error) {
      console.error(error);
      const message = axios.isAxiosError(error)
        ? (error.response?.data as { message?: string } | undefined)?.message
        : undefined;
      setFeedback({
        type: "error",
        message:
          message ?? "Registration failed. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const clearFeedback = () => setFeedback(null);

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg flex flex-col justify-between">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-extrabold text-blue-600">ServiceBoard</h1>
          <p className="text-gray-600">Create an account</p>
        </div>

        <div>
          <h1 className="text-3xl font-bold text-center mb-6">Register</h1>

          {feedback && (
            <StatusMessage
              type={feedback.type}
              message={feedback.message}
              onDismiss={clearFeedback}
            />
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                clearFeedback();
              }}
              className="w-full border p-3 rounded-lg"
              autoComplete="email"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                clearFeedback();
              }}
              className="w-full border p-3 rounded-lg"
              autoComplete="new-password"
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                clearFeedback();
              }}
              className="w-full border p-3 rounded-lg"
              autoComplete="new-password"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-60"
            >
              {loading ? "Registering…" : "Register"}
            </button>
            <p className="mt-4 text-center text-sm text-gray-600">
              Already have an account?
              <Link href="/login" className="text-blue-600 hover:underline">
                {" "}
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </main>
  );
}
