"use client";

import { useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import Header from "./Header";

interface DashboardLayoutProps {
    children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
    const { user } = useUser();
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        // Redirect to login if no user or token
        if (!user) {
            const token = localStorage.getItem("token");
            if (!token) {
                router.push("/login");
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

    if (!user) return null; // Already redirected

    return (
        <div className="min-h-screen max-h-screen bg-gray-50 flex flex-col">
            <Header />
            <main className="h-[calc(100vh-56px)] max-w-7xl mx-auto w-full py-6 sm:px-6 lg:px-8 flex flex-col">
                {children}
            </main>
        </div>
    );
}
