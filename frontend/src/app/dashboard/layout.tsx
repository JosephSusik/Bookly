"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { user } = useUser(); // Get current user from context

  useEffect(() => {
    if (!user) {
      // If user is not loaded yet, wait a bit
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login"); // No token → redirect
      }
    }

    setIsLoading(false);
  }, [user, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  return <>{children}</>;
}
