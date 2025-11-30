import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function GET(req) {
    try {
        const user = verifyToken(req);
        if (!user) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
        }

        const applications = await prisma.application.findMany({
            where: { userId: user.userId },
            include: {
                pet: true,
            },
            orderBy: { createdAt: "desc" },
        });

        return new Response(JSON.stringify(applications), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: "Error fetching applications" }), { status: 500 });
    }
}
