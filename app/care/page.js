"use client";
import { useState } from "react";
import AuthGuard from "@/components/AuthGuard";

export default function CarePage() {
    const [places, setPlaces] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [locationInput, setLocationInput] = useState("");
    const [searchedLocation, setSearchedLocation] = useState("");

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!locationInput.trim()) return;

        setLoading(true);
        setError(null);
        setSearchedLocation(locationInput);
        setPlaces([]);

        try {
            const res = await fetch(`/api/care/nearby?near=${encodeURIComponent(locationInput)}&query=pet`);
            if (!res.ok) throw new Error("Failed to fetch places");
            const data = await res.json();
            setPlaces(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthGuard>
            <div className="min-h-screen bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl mb-4">
                            Nearby Pet Care
                        </h1>
                        <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-8">
                            Enter your location to find veterinarians, pet stores, and other pet services nearby.
                        </p>

                        <form onSubmit={handleSearch} className="max-w-xl mx-auto flex gap-4">
                            <input
                                type="text"
                                value={locationInput}
                                onChange={(e) => setLocationInput(e.target.value)}
                                placeholder="Enter city, zip, or address (e.g., New York, NY)"
                                className="flex-1 border border-gray-300 rounded-full px-6 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
                            />
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-primary text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:bg-primary-dark transition transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? "Searching..." : "Search"}
                            </button>
                        </form>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg max-w-2xl mx-auto text-center mb-8">
                            {error}
                        </div>
                    )}

                    {loading ? (
                        <div className="flex justify-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {places.map((place) => (
                                <div key={place.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition">
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-900 mb-1">{place.name}</h3>
                                            <p className="text-sm text-primary font-medium">{place.categories}</p>
                                        </div>
                                        <div className="bg-gray-100 p-2 rounded-full">
                                            <svg className="w-6 h-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        </div>
                                    </div>
                                    <p className="text-gray-600 mb-4 text-sm">{place.address}</p>
                                    <div className="flex justify-between items-center pt-4 border-t border-gray-50">
                                        {place.distance && <span className="text-sm text-gray-500">{(place.distance / 1000).toFixed(1)} km away</span>}
                                        <a
                                            href={`https://www.google.com/maps/search/?api=1&query=${place.name} ${place.address}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-primary hover:text-primary-dark font-semibold text-sm flex items-center gap-1 ml-auto"
                                        >
                                            Get Directions
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                            </svg>
                                        </a>
                                    </div>
                                </div>
                            ))}
                            {places.length === 0 && searchedLocation && !loading && (
                                <div className="col-span-full text-center py-12 text-gray-500">
                                    No pet services found near "{searchedLocation}". Try a different location.
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </AuthGuard>
    );
}
