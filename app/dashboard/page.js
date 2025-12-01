"use client";
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import AuthGuard from "@/components/AuthGuard";

export default function Dashboard() {
    const { user } = useAuth();
    const router = useRouter();
    const [myApplications, setMyApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/applications/me", {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            if (res.ok) setMyApplications(await res.json());
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!user) {
            router.push("/login");
            return;
        }
        // Redirect Admin/Superadmin to Admin Panel
        if (user.role === "ADMIN" || user.role === "SUPERADMIN") {
            router.push("/admin");
            return;
        }
        fetchData();
    }, [user, fetchData, router]);

    if (!user) return null;

    return (
        <AuthGuard>
            <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-12">
                        <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
                        <p className="text-gray-500 mt-1">Manage your account and view adoption status.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* User Details Card */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-fit">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Personal Details</h2>
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-500">Full Name</label>
                                    <p className="text-gray-900 font-medium">{user.name}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500">Email Address</label>
                                    <p className="text-gray-900 font-medium">{user.email}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500">Role</label>
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                        {user.role}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Applications Section */}
                        <div className="md:col-span-2">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Adoption Applications</h2>
                            {loading ? (
                                <div className="flex justify-center py-12">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                                </div>
                            ) : (
                                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Pet Name</th>
                                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Submitted On</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {myApplications.map((app) => (
                                                    <tr key={app.id} className="hover:bg-gray-50 transition">
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{app.pet.name}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${app.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                                                                app.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                                                                    'bg-yellow-100 text-yellow-800'
                                                                }`}>
                                                                {app.status}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(app.createdAt).toLocaleDateString()}</td>
                                                    </tr>
                                                ))}
                                                {myApplications.length === 0 && (
                                                    <tr>
                                                        <td colSpan="3" className="px-6 py-12 text-center text-gray-500">You haven't submitted any applications yet.</td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthGuard>
    );
}
