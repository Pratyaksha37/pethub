import { NextResponse } from 'next/server';

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');
    const near = searchParams.get('near');
    const query = searchParams.get('query') || 'pet';

    const apiKey = "DDSZQFXYJ2FDPDA00CFAEHIU5AJE05QZBUP3Q13LBLAX3N40";

    if (!near && (!lat || !lng)) {
        return NextResponse.json({ error: "Location (near) or coordinates (lat, lng) are required" }, { status: 400 });
    }

    try {
        const searchParams = new URLSearchParams({
            query,
            limit: '20',
            fields: 'fsq_id,name,location,categories,distance,geocodes'
        });

        if (near) {
            searchParams.append('near', near);
        } else {
            searchParams.append('ll', `${lat},${lng}`);
        }

        const response = await fetch(`https://places-api.foursquare.com/places/search?${searchParams.toString()}`, {
            headers: {
                'Authorization': apiKey,
                'Accept': 'application/json',
                'X-Places-Api-Version': '2025-06-17'
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Foursquare API Error Status:", response.status);
            console.error("Foursquare API Error Body:", errorText);
            throw new Error(`Foursquare API error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        const places = data.results.map(place => ({
            id: place.fsq_id,
            name: place.name,
            address: place.location?.formatted_address || place.location?.address || "Address not available",
            distance: place.distance || 0,
            categories: place.categories?.map(c => c.name).join(', ') || "Uncategorized",
            geocodes: place.geocodes?.main || { latitude: 0, longitude: 0 },
        }));

        return NextResponse.json(places);
    } catch (error) {
        console.error("Error fetching nearby places:", error);
        return NextResponse.json({ error: "Failed to fetch nearby places" }, { status: 500 });
    }
}
