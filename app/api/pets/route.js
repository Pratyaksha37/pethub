import prisma from "@/lib/prisma";
import { verifyToken, isAdmin } from "@/lib/auth";

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get("page")) || 1;
        const limit = parseInt(searchParams.get("limit")) || 9;
        const skip = (page - 1) * limit;

        const status = searchParams.get("status");
        const breed = searchParams.get("breed");
        const type = searchParams.get("type");
        const ownerId = searchParams.get("ownerId");
        const sort = searchParams.get("sort") || "newest";

        const where = {};
        if (status) where.status = status;
        if (breed) where.breed = { contains: breed, mode: "insensitive" };
        if (type) where.type = type;
        if (ownerId) where.ownerId = parseInt(ownerId);

        const orderBy = {};
        if (sort === "newest") orderBy.createdAt = "desc";
        else if (sort === "oldest") orderBy.createdAt = "asc";

        const [pets, total] = await prisma.$transaction([
            prisma.pet.findMany({
                where,
                orderBy,
                skip,
                take: limit,
                include: { owner: { select: { name: true, email: true } } }
            }),
            prisma.pet.count({ where }),
        ]);

        return new Response(JSON.stringify({
            pets,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        }), { status: 200 });
    } catch (error) {
        console.error("Error fetching pets:", error);
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
        const {
            name, breed, age, size, description, image, status,
            type, gender, color, vaccinated, neutered
        } = body;

        const pet = await prisma.pet.create({
            data: {
                name,
                breed,
                age: String(age),
                size,
                description,
                image,
                status: status || "AVAILABLE",
                type: type || "Dog",
                gender: gender || "Unknown",
                color: color || "Unknown",
                vaccinated: vaccinated || false,
                neutered: neutered || false,
                ownerId: user.userId
            },
        });

        return new Response(JSON.stringify(pet), { status: 201 });
    } catch (error) {
        console.error("Error creating pet:", error);
        return new Response(JSON.stringify({ error: "Error creating pet" }), { status: 500 });
    }
}
