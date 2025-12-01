import prisma from "@/lib/prisma";
import { verifyToken, isAdmin } from "@/lib/auth";

export async function PUT(req, { params }) {
    try {
        const user = verifyToken(req);
        if (!isAdmin(user)) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 403 });
        }

        const { id } = await params;
        const { status } = await req.json();

        const application = await prisma.application.update({
            where: { id: parseInt(id) },
            data: { status },
        });

        return new Response(JSON.stringify(application), { status: 200 });
    } catch (error) {
        console.error("Error updating application:", error);
        return new Response(JSON.stringify({ error: "Error updating application" }), { status: 500 });
    }
}
