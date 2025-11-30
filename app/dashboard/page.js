"use client";
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AuthGuard from "@/components/AuthGuard";

export default function Dashboard() {
    const { user, logout } = useAuth();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState("applications");
    const [applications, setApplications] = useState([]);
    const [myApplications, setMyApplications] = useState([]);
    const [pets, setPets] = useState([]);
    const [loading, setLoading] = useState(true);


    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            if (user.role === "ADMIN") {
                if (activeTab === "applications") {
                    const res = await fetch("/api/applications", {
                        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                    });
                    if (res.ok) setApplications(await res.json());
                } else if (activeTab === "pets") {
                    const res = await fetch("/api/pets");
                    if (res.ok) setPets(await res.json());
                }
            } else {
                const res = await fetch("/api/applications/me", {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                });
                if (res.ok) setMyApplications(await res.json());
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    }, [user, activeTab]);

    useEffect(() => {
        if (!user) {
            router.push("/login");
            return;
        }
        fetchData();
    }, [fetchData]);

    const handleStatusUpdate = async (appId, status) => {
        // Placeholder for status update logic
        alert(`Update application ${appId} to ${status}`);
    };

    const handleDeletePet = async (petId) => {
        if (!confirm("Are you sure you want to delete this pet?")) return;
        try {
            const res = await fetch(`/api/pets/${petId}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            if (res.ok) {
                setPets(pets.filter(p => p.id !== petId));
            } else {
                alert("Failed to delete pet");
            }
        } catch (error) {
            console.error("Error deleting pet:", error);
        }
    };

    if (!user) return null;

    return (
        <AuthGuard>
            <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-center mb-12">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                            <p className="text-gray-500 mt-1">Welcome back, {user.name}</p>
                        </div>
                        {user.role === "ADMIN" && (
                            <div className="flex space-x-4 mt-4 md:mt-0">
                                <button
                                    onClick={() => setActiveTab("applications")}
                                    className={`px-6 py-2 rounded-full font-medium transition ${activeTab === "applications"
                                        ? "bg-primary text-white shadow-md"
                                        : "bg-white text-gray-600 hover:bg-gray-100"
                                        }`}
                                >
                                    Applications
                                </button>
                                <button
                                    onClick={() => setActiveTab("pets")}
                                    className={`px-6 py-2 rounded-full font-medium transition ${activeTab === "pets"
                                        ? "bg-primary text-white shadow-md"
                                        : "bg-white text-gray-600 hover:bg-gray-100"
                                        }`}
                                >
                                    Manage Pets
                                </button>
                            </div>
                        )}
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                        </div>
                    ) : (
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            {user.role === "ADMIN" ? (
                                activeTab === "applications" ? (
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Pet</th>
                                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Applicant</th>
                                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {applications.map((app) => (
                                                    <tr key={app.id} className="hover:bg-gray-50 transition">
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{app.pet.name}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{app.user.email}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${app.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                                                                app.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                                                                    'bg-yellow-100 text-yellow-800'
                                                                }`}>
                                                                {app.status}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(app.createdAt).toLocaleDateString()}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                                            <button onClick={() => handleStatusUpdate(app.id, 'APPROVED')} className="text-green-600 hover:text-green-900">Approve</button>
                                                            <button onClick={() => handleStatusUpdate(app.id, 'REJECTED')} className="text-red-600 hover:text-red-900">Reject</button>
                                                        </td>
                                                    </tr>
                                                ))}
                                                {applications.length === 0 && (
                                                    <tr>
                                                        <td colSpan="5" className="px-6 py-12 text-center text-gray-500">No applications found.</td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div className="p-6">
                                        <div className="flex justify-end mb-6">
                                            <button className="bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-dark transition shadow-sm">
                                                + Add New Pet
                                            </button>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {pets.map(pet => (
                                                <div key={pet.id} className="border border-gray-200 rounded-xl p-4 flex flex-col hover:shadow-md transition">
                                                    <img src={pet.image || "https://via.placeholder.com/150"} alt={pet.name} className="w-full h-40 object-cover rounded-lg mb-4" />
                                                    <h3 className="font-bold text-lg text-gray-900">{pet.name}</h3>
                                                    <p className="text-sm text-gray-500 mb-4">{pet.breed} • {pet.status}</p>
                                                    <div className="mt-auto flex justify-end space-x-2">
                                                        <button className="text-primary hover:text-primary-dark font-medium text-sm">Edit</button>
                                                        <button onClick={() => handleDeletePet(pet.id)} className="text-red-500 hover:text-red-700 font-medium text-sm">Delete</button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )
                            ) : (
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
                            )}
                        </div>
                    )}
                </div>
            </div>
        </AuthGuard>
    );
}
