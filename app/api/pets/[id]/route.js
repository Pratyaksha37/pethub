import prisma from "@/lib/prisma";
import { verifyToken, isAdmin } from "@/lib/auth";

export async function GET(req, { params }) {
    try {
        const { id } = params;
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

        const { id } = params;
        const body = await req.json();

        const pet = await prisma.pet.update({
            where: { id: parseInt(id) },
            data: {
                ...body,
                age: body.age ? parseInt(body.age) : undefined,
            },
        });

        return new Response(JSON.stringify(pet), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: "Error updating pet" }), { status: 500 });
    }
}

export async function DELETE(req, { params }) {
    try {
        const user = verifyToken(req);
        if (!isAdmin(user)) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 403 });
        }

        const { id } = params;
        await prisma.pet.delete({
            where: { id: parseInt(id) },
        });

        return new Response(JSON.stringify({ message: "Pet deleted" }), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: "Error deleting pet" }), { status: 500 });
    }
}
