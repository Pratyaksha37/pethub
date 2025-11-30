import prisma from "@/lib/prisma";
import { verifyToken, isAdmin } from "@/lib/auth";

export async function GET(req) {
    try {
        const user = verifyToken(req);
        if (!isAdmin(user)) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 403 });
        }

        const applications = await prisma.application.findMany({
            include: {
                user: { select: { name: true, email: true } },
                pet: { select: { name: true, image: true } },
            },
            orderBy: { createdAt: "desc" },
        });

        return new Response(JSON.stringify(applications), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: "Error fetching applications" }), { status: 500 });
    }
}

export async function POST(req) {
    try {
        const user = verifyToken(req);
        if (!user) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
        }

        const { petId, message } = await req.json();

        // Check if already applied
        const existing = await prisma.application.findFirst({
            where: {
                userId: user.userId,
                petId: parseInt(petId),
            },
        });

        if (existing) {
            return new Response(JSON.stringify({ error: "You have already applied for this pet" }), { status: 400 });
        }

        const application = await prisma.application.create({
            data: {
                userId: user.userId,
                petId: parseInt(petId),
                message,
            },
        });

        // Update pet status to PENDING? Or keep AVAILABLE until approved?
        // Keeping AVAILABLE for now so others can see it, but maybe mark as PENDING if strict.
        // Let's keep it simple.

        return new Response(JSON.stringify(application), { status: 201 });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: "Error submitting application" }), { status: 500 });
    }
}
