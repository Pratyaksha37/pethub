"use client";
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import AuthGuard from "@/components/AuthGuard";

export default function AdminDashboard() {
    const { user } = useAuth();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState("pets");
    const [pets, setPets] = useState([]);
    const [applications, setApplications] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deletePassword, setDeletePassword] = useState("");
    const [userToDelete, setUserToDelete] = useState(null);

    // Pagination State
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Pet Modal State
    const [isPetModalOpen, setIsPetModalOpen] = useState(false);
    const [editingPet, setEditingPet] = useState(null);
    const [petFormData, setPetFormData] = useState({
        name: "", breed: "", age: "", size: "Medium", type: "Dog",
        gender: "Unknown", color: "", vaccinated: false, neutered: false,
        description: "", image: "", status: "AVAILABLE"
    });

    useEffect(() => {
        if (user) {
            if (user.role === "SUPERADMIN") {
                setActiveTab("users");
            } else if (user.role === "ADMIN") {
                setActiveTab("pets");
            }
        }
    }, [user]);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const headers = {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            };

            if (activeTab === "pets" && user.role === "ADMIN") {
                let url = `/api/pets?page=${page}&limit=9&sort=newest&ownerId=${user.id}`;
                const res = await fetch(url, { headers });
                if (res.ok) {
                    const data = await res.json();
                    setPets(data.pets);
                    setTotalPages(data.pagination.totalPages);
                }
            } else if (activeTab === "applications" && user.role === "ADMIN") {
                const res = await fetch("/api/applications", { headers });
                if (res.ok) setApplications(await res.json());
            } else if (activeTab === "users" && user.role === "SUPERADMIN") {
                const res = await fetch("/api/users", { headers });
                if (res.ok) setUsers(await res.json());
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    }, [activeTab, user, page]);

    useEffect(() => {
        if (user) {
            fetchData();
        }
    }, [user, fetchData]);

    const handlePetSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            const url = editingPet ? `/api/pets/${editingPet.id}` : "/api/pets";
            const method = editingPet ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(petFormData),
            });

            if (res.ok) {
                setIsPetModalOpen(false);
                setEditingPet(null);
                setPetFormData({
                    name: "", breed: "", age: "", size: "Medium", type: "Dog",
                    gender: "Unknown", color: "", vaccinated: false, neutered: false,
                    description: "", image: "", status: "AVAILABLE"
                });
                fetchData();
                alert(editingPet ? "Pet updated successfully!" : "Pet added successfully!");
            } else {
                const data = await res.json();
                alert(data.error || "Failed to save pet");
            }
        } catch (error) {
            console.error("Error saving pet:", error);
        }
    };

    const openEditModal = (pet) => {
        setEditingPet(pet);
        setPetFormData({
            name: pet.name, breed: pet.breed, age: pet.age, size: pet.size,
            type: pet.type || "Dog", gender: pet.gender || "Unknown",
            color: pet.color || "", vaccinated: pet.vaccinated || false,
            neutered: pet.neutered || false, description: pet.description,
            image: pet.image, status: pet.status
        });
        setIsPetModalOpen(true);
    };

    const handleDeletePet = async (petId) => {
        if (!confirm("Are you sure you want to delete this pet?")) return;
        try {
            const res = await fetch(`/api/pets/${petId}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            if (res.ok) {
                fetchData(); // Refresh list
            } else {
                alert("Failed to delete pet");
            }
        } catch (error) {
            console.error("Error deleting pet:", error);
        }
    };

    const handleStatusUpdate = async (appId, status) => {
        try {
            const res = await fetch(`/api/applications/${appId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({ status }),
            });
            if (res.ok) {
                setApplications(applications.map(app => app.id === appId ? { ...app, status } : app));
            }
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    const handleDeleteUser = async () => {
        if (!deletePassword) return alert("Please enter your password");
        try {
            const res = await fetch(`/api/users/${userToDelete}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({ password: deletePassword }),
            });

            if (res.ok) {
                setUsers(users.filter(u => u.id !== userToDelete));
                setUserToDelete(null);
                setDeletePassword("");
                alert("User deleted successfully");
            } else {
                const data = await res.json();
                alert(data.error || "Failed to delete user");
            }
        } catch (error) {
            console.error("Error deleting user:", error);
        }
    };

    if (!user || (user.role !== "ADMIN" && user.role !== "SUPERADMIN")) return null;

    return (
        <AuthGuard>
            <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 relative">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-center mb-12">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
                            <p className="text-gray-500 mt-1">Manage your dashboard.</p>
                        </div>
                        <div className="flex space-x-4 mt-4 md:mt-0">
                            {user.role === "ADMIN" && (
                                <>
                                    <button
                                        onClick={() => { setActiveTab("pets"); setPage(1); }}
                                        className={`px-6 py-2 rounded-full font-medium transition capitalize ${activeTab === "pets" ? "bg-primary text-white shadow-md" : "bg-white text-gray-600 hover:bg-gray-100"}`}
                                    >
                                        Pets
                                    </button>
                                    <button
                                        onClick={() => { setActiveTab("applications"); setPage(1); }}
                                        className={`px-6 py-2 rounded-full font-medium transition capitalize ${activeTab === "applications" ? "bg-primary text-white shadow-md" : "bg-white text-gray-600 hover:bg-gray-100"}`}
                                    >
                                        Applications
                                    </button>
                                </>
                            )}
                            {user.role === "SUPERADMIN" && (
                                <button
                                    onClick={() => { setActiveTab("users"); setPage(1); }}
                                    className={`px-6 py-2 rounded-full font-medium transition capitalize ${activeTab === "users" ? "bg-primary text-white shadow-md" : "bg-white text-gray-600 hover:bg-gray-100"}`}
                                >
                                    Users
                                </button>
                            )}
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                        </div>
                    ) : (
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden p-6">
                            {activeTab === "pets" && user.role === "ADMIN" && (
                                <div>
                                    <div className="flex justify-end mb-6">
                                        <button
                                            onClick={() => {
                                                setEditingPet(null);
                                                setPetFormData({
                                                    name: "", breed: "", age: "", size: "Medium", type: "Dog",
                                                    gender: "Unknown", color: "", vaccinated: false, neutered: false,
                                                    description: "", image: "", status: "AVAILABLE"
                                                });
                                                setIsPetModalOpen(true);
                                            }}
                                            className="bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-dark transition shadow-sm"
                                        >
                                            + Add New Pet
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {pets.map(pet => (
                                            <div key={pet.id} className="border border-gray-200 rounded-xl p-4 flex flex-col hover:shadow-md transition">
                                                <img src={pet.image || "https://via.placeholder.com/150"} alt={pet.name} className="w-full h-40 object-cover rounded-lg mb-4" />
                                                <h3 className="font-bold text-lg text-gray-900">{pet.name}</h3>
                                                <p className="text-sm text-gray-500 mb-2">{pet.breed} • {pet.age}</p>
                                                <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full mb-4 w-fit ${pet.status === 'AVAILABLE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                    {pet.status}
                                                </span>
                                                <div className="mt-auto flex justify-end space-x-2">
                                                    <button onClick={() => openEditModal(pet)} className="text-primary hover:text-primary-dark font-medium text-sm">Edit</button>
                                                    <button onClick={() => handleDeletePet(pet.id)} className="text-red-500 hover:text-red-700 font-medium text-sm">Delete</button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    {/* Pagination */}
                                    <div className="flex justify-center mt-8 space-x-2">
                                        <button
                                            disabled={page === 1}
                                            onClick={() => setPage(p => Math.max(1, p - 1))}
                                            className="px-4 py-2 border rounded-lg disabled:opacity-50"
                                        >
                                            Previous
                                        </button>
                                        <span className="px-4 py-2 text-gray-600">Page {page} of {totalPages}</span>
                                        <button
                                            disabled={page === totalPages}
                                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                            className="px-4 py-2 border rounded-lg disabled:opacity-50"
                                        >
                                            Next
                                        </button>
                                    </div>
                                </div>
                            )}

                            {activeTab === "applications" && user.role === "ADMIN" && (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Pet</th>
                                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Applicant</th>
                                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {applications.map((app) => (
                                                <tr key={app.id} className="hover:bg-gray-50 transition">
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{app.pet.name}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{app.user.email}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${app.status === 'APPROVED' ? 'bg-green-100 text-green-800' : app.status === 'REJECTED' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                            {app.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                                        <button onClick={() => handleStatusUpdate(app.id, 'APPROVED')} className="text-green-600 hover:text-green-900">Approve</button>
                                                        <button onClick={() => handleStatusUpdate(app.id, 'REJECTED')} className="text-red-600 hover:text-red-900">Reject</button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {activeTab === "users" && user.role === "SUPERADMIN" && (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {users.map((u) => (
                                                <tr key={u.id} className="hover:bg-gray-50 transition">
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{u.name}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{u.email}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{u.role}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                        {u.role !== "SUPERADMIN" && (
                                                            <button
                                                                onClick={() => setUserToDelete(u.id)}
                                                                className="text-red-600 hover:text-red-900"
                                                            >
                                                                Delete
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Pet Modal - Seamless Styling */}
                {isPetModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
                        <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px] pointer-events-auto" onClick={() => setIsPetModalOpen(false)}></div>
                        <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto pointer-events-auto border border-gray-200 relative z-10">
                            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                                <h3 className="text-xl font-bold">{editingPet ? "Edit Pet" : "Add New Pet"}</h3>
                                <button onClick={() => setIsPetModalOpen(false)} className="text-gray-400 hover:text-gray-600">✕</button>
                            </div>
                            <form onSubmit={handlePetSubmit} className="p-6 space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input type="text" placeholder="Name" className="border p-2 rounded-lg w-full" value={petFormData.name} onChange={e => setPetFormData({ ...petFormData, name: e.target.value })} required />
                                    <input type="text" placeholder="Breed" className="border p-2 rounded-lg w-full" value={petFormData.breed} onChange={e => setPetFormData({ ...petFormData, breed: e.target.value })} required />
                                    <input type="text" placeholder="Age (e.g., 2 years)" className="border p-2 rounded-lg w-full" value={petFormData.age} onChange={e => setPetFormData({ ...petFormData, age: e.target.value })} required />
                                    <select className="border p-2 rounded-lg w-full" value={petFormData.size} onChange={e => setPetFormData({ ...petFormData, size: e.target.value })}>
                                        <option value="Small">Small</option>
                                        <option value="Medium">Medium</option>
                                        <option value="Large">Large</option>
                                    </select>
                                    <select className="border p-2 rounded-lg w-full" value={petFormData.type} onChange={e => setPetFormData({ ...petFormData, type: e.target.value })}>
                                        <option value="Dog">Dog</option>
                                        <option value="Cat">Cat</option>
                                        <option value="Bird">Bird</option>
                                        <option value="Other">Other</option>
                                    </select>
                                    <select className="border p-2 rounded-lg w-full" value={petFormData.gender} onChange={e => setPetFormData({ ...petFormData, gender: e.target.value })}>
                                        <option value="Unknown">Unknown</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                    </select>
                                    <input type="text" placeholder="Color" className="border p-2 rounded-lg w-full" value={petFormData.color} onChange={e => setPetFormData({ ...petFormData, color: e.target.value })} />
                                    <input type="text" placeholder="Image URL" className="border p-2 rounded-lg w-full md:col-span-2" value={petFormData.image} onChange={e => setPetFormData({ ...petFormData, image: e.target.value })} required />
                                </div>
                                <textarea placeholder="Description" className="border p-2 rounded-lg w-full h-24" value={petFormData.description} onChange={e => setPetFormData({ ...petFormData, description: e.target.value })} required></textarea>
                                <div className="flex gap-4">
                                    <label className="flex items-center gap-2">
                                        <input type="checkbox" checked={petFormData.vaccinated} onChange={e => setPetFormData({ ...petFormData, vaccinated: e.target.checked })} /> Vaccinated
                                    </label>
                                    <label className="flex items-center gap-2">
                                        <input type="checkbox" checked={petFormData.neutered} onChange={e => setPetFormData({ ...petFormData, neutered: e.target.checked })} /> Neutered
                                    </label>
                                </div>
                                <div className="flex justify-end gap-3 pt-4">
                                    <button type="button" onClick={() => setIsPetModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                                    <button type="submit" className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark">{editingPet ? "Update Pet" : "Add Pet"}</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Delete User Modal - Seamless Styling */}
                {userToDelete && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
                        <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px] pointer-events-auto" onClick={() => { setUserToDelete(null); setDeletePassword(""); }}></div>
                        <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-sm w-full pointer-events-auto border border-gray-200 relative z-10">
                            <h3 className="text-xl font-bold mb-4">Confirm Deletion</h3>
                            <p className="text-gray-500 mb-6">Enter your password to confirm user deletion.</p>
                            <input
                                type="password"
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-6"
                                placeholder="Your Password"
                                value={deletePassword}
                                onChange={(e) => setDeletePassword(e.target.value)}
                            />
                            <div className="flex justify-end space-x-4">
                                <button
                                    onClick={() => { setUserToDelete(null); setDeletePassword(""); }}
                                    className="text-gray-500 hover:text-gray-700 font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDeleteUser}
                                    className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700"
                                >
                                    Delete User
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AuthGuard>
    );
}
