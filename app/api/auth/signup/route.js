import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    const { name, email, password, role } = await req.json();

    if (!name || !email || !password) {
      return new Response(JSON.stringify({ error: "Missing fields" }), { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return new Response(JSON.stringify({ error: "User already exists" }), { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Default to USER if role is not provided or invalid (prevent SUPERADMIN creation via API)
    const assignedRole = (role === "ADMIN" || role === "USER") ? role : "USER";

    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword, role: assignedRole },
    });

    const token = jwt.sign({ userId: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET || "secret_key", { expiresIn: "7d" });

    return new Response(JSON.stringify({ message: "User created", token, user }), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Error creating user" }), { status: 500 });
  }
}
