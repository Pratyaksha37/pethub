import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export async function DELETE(req, { params }) {
    try {
        const { id } = await params;
        const { password } = await req.json();
        const authHeader = req.headers.get("authorization");

        if (!authHeader) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret_key");

        // Only SUPERADMIN can delete users
        if (decoded.role !== "SUPERADMIN") {
            return new Response(JSON.stringify({ error: "Forbidden: Only Superadmin can delete users" }), { status: 403 });
        }

        // Verify Superadmin password
        const superadmin = await prisma.user.findUnique({ where: { id: decoded.userId } });
        const isPasswordValid = await bcrypt.compare(password, superadmin.password);

        if (!isPasswordValid) {
            return new Response(JSON.stringify({ error: "Invalid password" }), { status: 401 });
        }

        // Prevent deleting self
        if (parseInt(id) === superadmin.id) {
            return new Response(JSON.stringify({ error: "Cannot delete your own account" }), { status: 400 });
        }

        await prisma.user.delete({ where: { id: parseInt(id) } });

        return new Response(JSON.stringify({ message: "User deleted successfully" }), { status: 200 });
    } catch (error) {
        console.error("Delete user error:", error);
        return new Response(JSON.stringify({ error: "Failed to delete user" }), { status: 500 });
    }
}
