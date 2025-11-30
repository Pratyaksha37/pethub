import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return new Response(JSON.stringify({ error: "Missing fields" }), { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return new Response(JSON.stringify({ error: "Invalid password" }), { status: 401 });
    }

    const token = jwt.sign({ userId: user.id, email: user.email, role: user.role }, "secret_key", { expiresIn: "7d" });

    return new Response(JSON.stringify({ message: "Login successful", token, user }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Error logging in" }), { status: 500 });
  }
}