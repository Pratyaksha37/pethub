import { NextResponse } from 'next/server';

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const near = searchParams.get('near');
    const query = searchParams.get('query') || 'pet';

    if (!near) {
        return NextResponse.json({ error: "Location (near) is required" }, { status: 400 });
    }

    try {
        // 1. Geocode the location using Nominatim
        const nominatimRes = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(near)}&format=json&limit=1`, {
            headers: {
                'User-Agent': 'PetHub/1.0 (contact@pethub.com)' // Required by Nominatim
            }
        });

        if (!nominatimRes.ok) throw new Error("Failed to geocode location");
        const geocodeData = await nominatimRes.json();

        if (!geocodeData || geocodeData.length === 0) {
            return NextResponse.json({ error: "Location not found" }, { status: 404 });
        }

        const { lat, lon } = geocodeData[0];

        // 2. Search for amenities using Overpass API
        // We'll search for vets, pet shops, and parks within 5000m (5km)
        const radius = 5000;
        const overpassQuery = `
            [out:json];
            node["amenity"="veterinary"](around:${radius},${lat},${lon});
            out body;
        `;

        const overpassRes = await fetch(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(overpassQuery)}`);

        if (!overpassRes.ok) throw new Error("Failed to fetch places from Overpass");
        const overpassData = await overpassRes.json();

        // 3. Map the data to our frontend format
        // 3. Map the data to our frontend format
        const allPlaces = overpassData.elements.map(place => {
            return {
                id: place.id.toString(),
                name: place.tags.name || "Unnamed Vet Clinic",
                address: place.tags["addr:street"] ? `${place.tags["addr:street"]} ${place.tags["addr:housenumber"] || ''}, ${place.tags["addr:city"] || ''}` : "Address not available",
                distance: 0, // Overpass doesn't return distance directly
                categories: "Veterinary Care",
                geocodes: { latitude: place.lat, longitude: place.lon }
            };
        });

        // Pagination
        const page = parseInt(searchParams.get("page")) || 1;
        const limit = parseInt(searchParams.get("limit")) || 9;
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedPlaces = allPlaces.slice(startIndex, endIndex);

        return NextResponse.json({
            places: paginatedPlaces,
            pagination: {
                total: allPlaces.length,
                page,
                limit,
                totalPages: Math.ceil(allPlaces.length / limit)
            }
        });

    } catch (error) {
        console.error("Error fetching nearby places:", error);
        return NextResponse.json({ error: "Failed to fetch nearby places" }, { status: 500 });
    }
}
