"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { isAuthenticated } from "@/lib/auth";

const AUTH_PAGES = ["/login", "/registration"];

export default function LayoutShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const isAuthPage = AUTH_PAGES.includes(pathname as typeof AUTH_PAGES[number]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const loggedIn = isAuthenticated();

    if (!loggedIn && !isAuthPage) {
      router.replace("/login");
      return;
    }

    if (loggedIn && isAuthPage) {
      router.replace("/");
      return;
    }

    setReady(true);
  }, [pathname, isAuthPage, router]);

  if (!ready) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-100">
        <p className="text-gray-600">Loading…</p>
      </main>
    );
  }

  return (
    <>
      {!isAuthPage && <Navbar />}
      {children}
    </>
  );
}
