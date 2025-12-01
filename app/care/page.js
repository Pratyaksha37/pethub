"use client";
import { useState, useEffect } from "react";
import AuthGuard from "@/components/AuthGuard";

export default function CarePage() {
    const [places, setPlaces] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [locationInput, setLocationInput] = useState("");
    const [searchedLocation, setSearchedLocation] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const handleSearch = async (e) => {
        if (e) e.preventDefault();
        if (!locationInput.trim() && !searchedLocation) return;

        const queryLocation = locationInput || searchedLocation;

        setLoading(true);
        setError(null);
        setSearchedLocation(queryLocation);
        if (e) setPage(1); // Reset page on new search

        try {
            const res = await fetch(
                `/api/care/nearby?near=${encodeURIComponent(queryLocation)}&query=pet&page=${e ? 1 : page}&limit=9`
            );

            if (!res.ok) throw new Error("Failed to fetch places");

            const data = await res.json();
            setPlaces(data.places);
            setTotalPages(data.pagination.totalPages);
        } catch (err) {
            setError(err.message);
            setPlaces([]);
        } finally {
            setLoading(false);
        }
    };

    // Trigger search when page changes
    useEffect(() => {
        if (searchedLocation) {
            handleSearch();
        }
    }, [page]);

    return (
        <AuthGuard>
            <div className="min-h-screen bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">

                    {/* Heading */}
                    <div className="text-center mb-16">
                        <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl mb-4">
                            Find Nearby Care
                        </h1>
                        <p className="text-xl text-gray-500 max-w-2xl mx-auto">
                            Locate the best veterinary clinics and pet services in your neighborhood.
                        </p>
                    </div>

                    {/* Search Bar */}
                    <form
                        onSubmit={handleSearch}
                        className="max-w-2xl mx-auto flex gap-4 mb-16"
                    >
                        <input
                            type="text"
                            value={locationInput}
                            onChange={(e) => setLocationInput(e.target.value)}
                            placeholder="Enter your city (e.g., New York, Mumbai)"
                            className="flex-1 px-6 py-4 rounded-xl border border-gray-300 text-lg bg-white shadow-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-8 py-4 rounded-xl bg-primary text-white font-bold text-lg shadow-md hover:bg-primary-dark transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? "Searching..." : "Search"}
                        </button>
                    </form>

                    {/* Error */}
                    {error && (
                        <div className="max-w-2xl mx-auto mb-8 bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl text-center">
                            {error}
                        </div>
                    )}

                    {/* Loader */}
                    {loading && (
                        <div className="flex justify-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                        </div>
                    )}

                    {/* Results */}
                    {!loading && places.length > 0 && (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                {places.map((place) => (
                                    <div
                                        key={place.id}
                                        className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition flex flex-col h-full"
                                    >
                                        <div className="flex items-start justify-between mb-4">
                                            <div>
                                                <h3 className="text-xl font-bold text-gray-900 line-clamp-1">{place.name}</h3>
                                                <p className="text-sm text-primary font-medium mt-1">{place.categories}</p>
                                            </div>
                                            <div className="bg-blue-50 p-2 rounded-lg">
                                                <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                            </div>
                                        </div>

                                        <p className="text-gray-500 text-sm mb-6 flex-grow">
                                            {place.address}
                                        </p>

                                        <div className="pt-4 border-t border-gray-50 flex items-center justify-between mt-auto">
                                            <span className="text-gray-400 text-sm font-medium">
                                                {place.distance ? `${(place.distance / 1000).toFixed(1)} km away` : "Nearby"}
                                            </span>

                                            <a
                                                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name + " " + place.address)}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-primary hover:text-primary-dark font-semibold text-sm flex items-center gap-1"
                                            >
                                                Get Directions
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                </svg>
                                            </a>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
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
                        </>
                    )}

                    {/* No Results */}
                    {!loading && places.length === 0 && searchedLocation && (
                        <div className="text-center py-20">
                            <div className="bg-gray-100 rounded-full h-20 w-20 flex items-center justify-center mx-auto mb-6">
                                <svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900">No places found</h3>
                            <p className="text-gray-500 mt-2">
                                We couldn't find any veterinary clinics near <b>{searchedLocation}</b>.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </AuthGuard>
    );
}
