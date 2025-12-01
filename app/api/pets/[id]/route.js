import prisma from "@/lib/prisma";
import { verifyToken, isAdmin } from "@/lib/auth";

export async function GET(req, { params }) {
    try {
        const { id } = await params;
        const pet = await prisma.pet.findUnique({
            where: { id: parseInt(id) },
        });

        if (!pet) {
            return new Response(JSON.stringify({ error: "Pet not found" }), { status: 404 });
        }

        return new Response(JSON.stringify(pet), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: "Error fetching pet" }), { status: 500 });
    }
}

export async function PUT(req, { params }) {
    try {
        const user = verifyToken(req);
        if (!isAdmin(user)) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 403 });
        }

        const { id } = await params;
        const body = await req.json();

        // Check ownership
        const existingPet = await prisma.pet.findUnique({ where: { id: parseInt(id) } });
        if (!existingPet) return new Response(JSON.stringify({ error: "Pet not found" }), { status: 404 });

        if (existingPet.ownerId !== user.userId && user.role !== "SUPERADMIN") {
            return new Response(JSON.stringify({ error: "Forbidden: You can only edit your own pets" }), { status: 403 });
        }

        const pet = await prisma.pet.update({
            where: { id: parseInt(id) },
            data: {
                ...body,
                age: body.age ? String(body.age) : undefined,
            },
        });

        return new Response(JSON.stringify(pet), { status: 200 });
    } catch (error) {
        console.error("Error updating pet:", error);
        return new Response(JSON.stringify({ error: "Error updating pet" }), { status: 500 });
    }
}

export async function DELETE(req, { params }) {
    try {
        const user = verifyToken(req);
        if (!isAdmin(user)) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 403 });
        }

        const { id } = await params;

        // Check ownership
        const existingPet = await prisma.pet.findUnique({ where: { id: parseInt(id) } });
        if (!existingPet) return new Response(JSON.stringify({ error: "Pet not found" }), { status: 404 });

        if (existingPet.ownerId !== user.userId && user.role !== "SUPERADMIN") {
            return new Response(JSON.stringify({ error: "Forbidden: You can only delete your own pets" }), { status: 403 });
        }

        await prisma.pet.delete({
            where: { id: parseInt(id) },
        });

        return new Response(JSON.stringify({ message: "Pet deleted" }), { status: 200 });
    } catch (error) {
        console.error("Error deleting pet:", error);
        return new Response(JSON.stringify({ error: "Error deleting pet" }), { status: 500 });
    }
}
