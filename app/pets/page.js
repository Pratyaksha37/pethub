"use client";
import { useState, useEffect } from "react";
import PetCard from "../../components/PetCard";
import AuthGuard from "@/components/AuthGuard";

export default function PetsPage() {
    const [pets, setPets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPets();
    }, []);

    const fetchPets = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/pets");
            const data = await res.json();
            setPets(data);
        } catch (error) {
            console.error("Error fetching pets:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthGuard>
            <div className="min-h-screen bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl mb-4">
                            Adopt a Friend
                        </h1>
                        <p className="text-xl text-gray-500 max-w-2xl mx-auto">
                            Browse our available pets and find your perfect match. They are waiting for you.
                        </p>
                    </div>

                    {/* Grid */}
                    {loading ? (
                        <div className="flex justify-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {pets.map((pet) => (
                                <PetCard key={pet.id} pet={pet} />
                            ))}
                        </div>
                    )}

                    {!loading && pets.length === 0 && (
                        <div className="text-center py-20">
                            <p className="text-gray-500 text-lg">No pets found.</p>
                        </div>
                    )}
                </div>
            </div>
        </AuthGuard>
    );
}
