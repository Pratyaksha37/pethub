import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";

export async function GET(req) {
    try {
        const authHeader = req.headers.get("authorization");
        if (!authHeader) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret_key");

        if (decoded.role !== "ADMIN" && decoded.role !== "SUPERADMIN") {
            return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403 });
        }

        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get("page")) || 1;
        const limit = parseInt(searchParams.get("limit")) || 10;
        const skip = (page - 1) * limit;
        const sort = searchParams.get("sort") || "newest";

        const orderBy = {};
        if (sort === "newest") orderBy.createdAt = "desc";
        else if (sort === "oldest") orderBy.createdAt = "asc";

        const [users, total] = await prisma.$transaction([
            prisma.user.findMany({
                select: { id: true, name: true, email: true, role: true, createdAt: true },
                orderBy,
                skip,
                take: limit,
            }),
            prisma.user.count(),
        ]);

        return new Response(JSON.stringify({
            users,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        }), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: "Failed to fetch users" }), { status: 500 });
    }
}
