"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter, useParams } from "next/navigation";

export default function PetDetailsPage() {
    const { id } = useParams();
    const [pet, setPet] = useState(null);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const router = useRouter();
    const [applying, setApplying] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        fetchPet();
    }, [id]);

    const fetchPet = async () => {
        try {
            const res = await fetch(`/api/pets/${id}`);
            const data = await res.json();
            if (res.ok) setPet(data);
        } catch (error) {
            console.error("Error fetching pet:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleApply = async (e) => {
        e.preventDefault();
        if (!user) {
            router.push("/login");
            return;
        }
        setApplying(true);
        try {
            const res = await fetch("/api/applications", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({ petId: pet.id, message }),
            });
            if (res.ok) {
                alert("Application submitted successfully!");
                setMessage("");
            } else {
                const data = await res.json();
                alert(data.error || "Failed to submit application");
            }
        } catch (error) {
            console.error("Error applying:", error);
        } finally {
            setApplying(false);
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;
    if (!pet) return <div className="min-h-screen flex items-center justify-center text-xl text-gray-500">Pet not found</div>;

    return (
        <div className="min-h-screen bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                <div className="md:flex">
                    <div className="md:w-1/2 relative h-96 md:h-auto">
                        <img
                            className="absolute inset-0 w-full h-full object-cover"
                            src={pet.image || "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=800&q=80"}
                            alt={pet.name}
                        />
                        <div className="absolute top-4 left-4">
                            <button onClick={() => router.back()} className="bg-white/90 p-2 rounded-full shadow-md hover:bg-white transition">
                                <svg className="w-6 h-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                            </button>
                        </div>
                    </div>
                    <div className="p-8 md:p-12 md:w-1/2 flex flex-col justify-center">
                        <div className="uppercase tracking-wide text-sm text-primary font-bold mb-2">{pet.breed}</div>
                        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">{pet.name}</h1>

                        <div className="flex items-center gap-6 text-gray-600 mb-8">
                            <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-lg">
                                <span className="font-semibold text-gray-900">{pet.age}</span> years
                            </div>
                            <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-lg">
                                <span className="font-semibold text-gray-900">{pet.size}</span> size
                            </div>
                            <div className={`px-4 py-2 rounded-lg text-sm font-bold text-white ${pet.status === 'AVAILABLE' ? 'bg-green-500' : 'bg-gray-500'}`}>
                                {pet.status}
                            </div>
                        </div>

                        <h3 className="text-lg font-semibold text-gray-900 mb-2">About {pet.name}</h3>
                        <p className="text-gray-600 leading-relaxed mb-8">{pet.description}</p>

                        <div className="mt-auto border-t border-gray-100 pt-8">
                            {pet.status === 'AVAILABLE' ? (
                                <>
                                    <h3 className="text-lg font-bold text-gray-900 mb-4">Interested in adopting?</h3>
                                    <form onSubmit={handleApply} className="space-y-4">
                                        <textarea
                                            className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition resize-none bg-gray-50 focus:bg-white"
                                            rows="3"
                                            placeholder="Tell us why you'd be a great owner..."
                                            value={message}
                                            onChange={(e) => setMessage(e.target.value)}
                                            required
                                        ></textarea>
                                        <button
                                            type="submit"
                                            disabled={applying}
                                            className="w-full bg-primary text-white font-bold py-4 px-6 rounded-xl hover:bg-primary-dark transition transform hover:-translate-y-0.5 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {applying ? "Submitting Application..." : "Submit Adoption Application"}
                                        </button>
                                    </form>
                                </>
                            ) : (
                                <div className="bg-gray-100 p-6 rounded-xl text-center">
                                    <p className="text-gray-600 font-medium">This pet is currently {pet.status.toLowerCase()}.</p>
                                    <p className="text-sm text-gray-500 mt-2">Check out our other available pets!</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
