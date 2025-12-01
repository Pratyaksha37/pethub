"use client";
import { useState, useEffect, useCallback } from "react";
import PetCard from "../../components/PetCard";
import AuthGuard from "@/components/AuthGuard";
import { useAuth } from "@/context/AuthContext";

export default function PetsPage() {
    const { user } = useAuth();
    const [pets, setPets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Filters
    const [filters, setFilters] = useState({
        type: "",
        breed: "",
        sort: "newest"
    });

    // Modal
    const [selectedPet, setSelectedPet] = useState(null);
    const [applicationMessage, setApplicationMessage] = useState("");
    const [applying, setApplying] = useState(false);

    const fetchPets = useCallback(async () => {
        setLoading(true);
        try {
            const query = new URLSearchParams({
                page,
                limit: 9,
                sort: filters.sort,
                ...(filters.type && { type: filters.type }),
                ...(filters.breed && { breed: filters.breed }),
                status: "AVAILABLE"
            });

            const res = await fetch(`/api/pets?${query}`);
            const data = await res.json();

            if (res.ok && data.pagination) {
                setPets(data.pets);
                setTotalPages(data.pagination.totalPages);
            } else {
                console.error("Failed to fetch pets:", data.error || "Unknown error");
                setPets([]);
            }
        } catch (error) {
            console.error("Error fetching pets:", error);
            setPets([]);
        } finally {
            setLoading(false);
        }
    }, [page, filters]);

    useEffect(() => {
        fetchPets();
    }, [fetchPets]);

    const handleAdopt = async (e) => {
        e.preventDefault();
        if (!user) return alert("Please login to adopt");

        setApplying(true);
        try {
            const res = await fetch("/api/applications", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({
                    petId: selectedPet.id,
                    message: applicationMessage
                }),
            });

            if (res.ok) {
                alert("Application submitted successfully!");
                setSelectedPet(null);
                setApplicationMessage("");
                fetchPets(); // Refresh to update status if needed
            } else {
                const data = await res.json();
                alert(data.error || "Failed to submit application");
            }
        } catch (error) {
            console.error("Error submitting application:", error);
        } finally {
            setApplying(false);
        }
    };

    return (
        <AuthGuard>
            <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl mb-4">
                            Adopt a Friend
                        </h1>
                        <p className="text-xl text-gray-500 max-w-2xl mx-auto">
                            Browse our available pets and find your perfect match.
                        </p>
                    </div>

                    {/* Filters & Sort */}
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row gap-4 justify-between items-center">
                        <div className="flex gap-4 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                            <select
                                className="border p-2 rounded-lg min-w-[120px]"
                                value={filters.type}
                                onChange={(e) => { setFilters({ ...filters, type: e.target.value }); setPage(1); }}
                            >
                                <option value="">All Types</option>
                                <option value="Dog">Dogs</option>
                                <option value="Cat">Cats</option>
                                <option value="Bird">Birds</option>
                                <option value="Other">Other</option>
                            </select>
                            <input
                                type="text"
                                placeholder="Search Breed..."
                                className="border p-2 rounded-lg min-w-[150px]"
                                value={filters.breed}
                                onChange={(e) => { setFilters({ ...filters, breed: e.target.value }); setPage(1); }}
                            />
                        </div>
                        <select
                            className="border p-2 rounded-lg"
                            value={filters.sort}
                            onChange={(e) => { setFilters({ ...filters, sort: e.target.value }); setPage(1); }}
                        >
                            <option value="newest">Newest First</option>
                            <option value="oldest">Oldest First</option>
                        </select>
                    </div>

                    {/* Grid */}
                    {loading ? (
                        <div className="flex justify-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {pets.map((pet) => (
                                <PetCard key={pet.id} pet={pet} onClick={setSelectedPet} />
                            ))}
                        </div>
                    )}

                    {!loading && pets.length === 0 && (
                        <div className="text-center py-20">
                            <p className="text-gray-500 text-lg">No pets found matching your criteria.</p>
                        </div>
                    )}

                    {/* Pagination */}
                    {!loading && totalPages > 1 && (
                        <div className="flex justify-center mt-12 space-x-2">
                            <button
                                disabled={page === 1}
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                className="px-4 py-2 border rounded-lg disabled:opacity-50 hover:bg-gray-50"
                            >
                                Previous
                            </button>
                            <span className="px-4 py-2 text-gray-600 font-medium">Page {page} of {totalPages}</span>
                            <button
                                disabled={page === totalPages}
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                className="px-4 py-2 border rounded-lg disabled:opacity-50 hover:bg-gray-50"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </div>

                {/* Pet Details Modal - Seamless Styling */}
                {selectedPet && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
                        <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px] pointer-events-auto" onClick={() => setSelectedPet(null)}></div>
                        <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full overflow-hidden flex flex-col md:flex-row max-h-[90vh] pointer-events-auto border border-gray-200 relative z-10">
                            <div className="md:w-1/2 h-64 md:h-auto relative">
                                <img
                                    src={selectedPet.image || "https://via.placeholder.com/400"}
                                    alt={selectedPet.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="md:w-1/2 p-8 overflow-y-auto">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h2 className="text-3xl font-bold text-gray-900">{selectedPet.name}</h2>
                                        <p className="text-primary font-semibold text-lg">{selectedPet.breed}</p>
                                    </div>
                                    <button onClick={() => setSelectedPet(null)} className="text-gray-400 hover:text-gray-600 text-2xl">✕</button>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                                    <div className="bg-gray-50 p-3 rounded-lg">
                                        <span className="block text-gray-500 text-xs uppercase">Age</span>
                                        <span className="font-semibold">{selectedPet.age}</span>
                                    </div>
                                    <div className="bg-gray-50 p-3 rounded-lg">
                                        <span className="block text-gray-500 text-xs uppercase">Gender</span>
                                        <span className="font-semibold">{selectedPet.gender}</span>
                                    </div>
                                    <div className="bg-gray-50 p-3 rounded-lg">
                                        <span className="block text-gray-500 text-xs uppercase">Size</span>
                                        <span className="font-semibold">{selectedPet.size}</span>
                                    </div>
                                    <div className="bg-gray-50 p-3 rounded-lg">
                                        <span className="block text-gray-500 text-xs uppercase">Color</span>
                                        <span className="font-semibold">{selectedPet.color}</span>
                                    </div>
                                </div>

                                <div className="flex gap-4 mb-6">
                                    {selectedPet.vaccinated && (
                                        <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-bold rounded-full">Vaccinated</span>
                                    )}
                                    {selectedPet.neutered && (
                                        <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded-full">Neutered</span>
                                    )}
                                </div>

                                <div className="mb-8">
                                    <h3 className="text-lg font-bold mb-2">About {selectedPet.name}</h3>
                                    <p className="text-gray-600 leading-relaxed">{selectedPet.description}</p>
                                </div>

                                <form onSubmit={handleAdopt} className="border-t pt-6">
                                    <h3 className="text-lg font-bold mb-4">Interested in Adopting?</h3>
                                    <textarea
                                        className="w-full border border-gray-300 rounded-lg p-3 mb-4 focus:ring-2 focus:ring-primary outline-none"
                                        rows="3"
                                        placeholder="Tell us why you'd be a great pet parent..."
                                        value={applicationMessage}
                                        onChange={(e) => setApplicationMessage(e.target.value)}
                                        required
                                    ></textarea>
                                    <button
                                        type="submit"
                                        disabled={applying}
                                        className="w-full bg-primary text-white py-3 rounded-xl font-bold text-lg shadow-lg hover:bg-primary-dark transition disabled:opacity-50"
                                    >
                                        {applying ? "Submitting..." : "Submit Application"}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AuthGuard>
    );
}
