import prisma from "@/lib/prisma";
import { verifyToken, isAdmin } from "@/lib/auth";

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const status = searchParams.get("status");
        const breed = searchParams.get("breed");
        const size = searchParams.get("size");

        const where = {};
        if (status) where.status = status;
        if (breed) where.breed = { contains: breed, mode: "insensitive" };
        if (size) where.size = size;

        const pets = await prisma.pet.findMany({
            where,
            orderBy: { createdAt: "desc" },
        });

        return new Response(JSON.stringify(pets), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: "Error fetching pets" }), { status: 500 });
    }
}

export async function POST(req) {
    try {
        const user = verifyToken(req);
        if (!isAdmin(user)) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 403 });
        }

        const body = await req.json();
        const { name, breed, age, size, description, image, status } = body;

        const pet = await prisma.pet.create({
            data: {
                name,
                breed,
                age: parseInt(age),
                size,
                description,
                image,
                status: status || "AVAILABLE",
            },
        });

        return new Response(JSON.stringify(pet), { status: 201 });
    } catch (error) {
        return new Response(JSON.stringify({ error: "Error creating pet" }), { status: 500 });
    }
}
