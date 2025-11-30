"use client";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function AuthGuard({ children }) {
    const { user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/login");
        }
    }, [user, router]);

    if (!user) {
        return null; // Or a loading spinner
    }

    return <>{children}</>;
}
