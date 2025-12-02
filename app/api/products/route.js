import prisma from "@/lib/prisma";
import { verifyToken, isAdmin } from "@/lib/auth";

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get("page")) || 1;
        const limit = parseInt(searchParams.get("limit")) || 9;
        const skip = (page - 1) * limit;
        const sort = searchParams.get("sort") || "newest";

        const orderBy = {};
        if (sort === "newest") orderBy.createdAt = "desc";
        else if (sort === "oldest") orderBy.createdAt = "asc";
        else if (sort === "price_asc") orderBy.price = "asc";
        else if (sort === "price_desc") orderBy.price = "desc";

        const [products, total] = await prisma.$transaction([
            prisma.product.findMany({
                orderBy,
                skip,
                take: limit,
            }),
            prisma.product.count(),
        ]);

        return new Response(JSON.stringify({
            products,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        }), { status: 200 });
    } catch (error) {
        console.error("Error fetching products:", error);
        return new Response(JSON.stringify({ error: "Error fetching products" }), { status: 500 });
    }
}

export async function POST(req) {
    try {
        const user = verifyToken(req);
        if (!isAdmin(user)) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 403 });
        }

        const body = await req.json();
        const { name, category, price, description, imageUrl, inStock } = body;

        const product = await prisma.product.create({
            data: {
                name,
                category,
                price: parseFloat(price),
                description,
                imageUrl,
                inStock: inStock !== undefined ? inStock : true,
            },
        });

        return new Response(JSON.stringify(product), { status: 201 });
    } catch (error) {
        console.error("Error creating product:", error);
        return new Response(JSON.stringify({ error: "Error creating product" }), { status: 500 });
    }
}
