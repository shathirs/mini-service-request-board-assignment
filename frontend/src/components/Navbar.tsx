"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import api from "@/services/api";
import { clearSession } from "@/lib/auth";

export default function Navbar() {
  const router = useRouter();

  async function handleLogout() {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error(error);
    } finally {
      clearSession();
      router.push("/login");
      router.refresh();
    }
  }

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-blue-600">
          ServiceBoard
        </Link>

        <nav className="flex items-center gap-6">
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 transition hover:border-red-300 hover:bg-red-100 hover:text-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 active:scale-[0.98]"
          >
            Log out
          </button>
        </nav>
      </div>
    </header>
  );
}
