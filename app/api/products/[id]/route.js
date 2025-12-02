import prisma from "@/lib/prisma";
import { verifyToken, isAdmin } from "@/lib/auth";

export async function GET(req, { params }) {
    try {
        const { id } = await params;
        const product = await prisma.product.findUnique({
            where: { id: parseInt(id) },
        });

        if (!product) {
            return new Response(JSON.stringify({ error: "Product not found" }), { status: 404 });
        }

        return new Response(JSON.stringify(product), { status: 200 });
    } catch (error) {
        console.error("Error fetching product:", error);
        return new Response(JSON.stringify({ error: "Error fetching product" }), { status: 500 });
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

        // Ensure price is a float if it's being updated
        if (body.price) {
            body.price = parseFloat(body.price);
        }

        const product = await prisma.product.update({
            where: { id: parseInt(id) },
            data: body,
        });

        return new Response(JSON.stringify(product), { status: 200 });
    } catch (error) {
        console.error("Error updating product:", error);
        return new Response(JSON.stringify({ error: "Error updating product" }), { status: 500 });
    }
}

export async function DELETE(req, { params }) {
    try {
        const user = verifyToken(req);
        if (!isAdmin(user)) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 403 });
        }

        const { id } = await params;

        await prisma.product.delete({
            where: { id: parseInt(id) },
        });

        return new Response(JSON.stringify({ message: "Product deleted" }), { status: 200 });
    } catch (error) {
        console.error("Error deleting product:", error);
        return new Response(JSON.stringify({ error: "Error deleting product" }), { status: 500 });
    }
}
