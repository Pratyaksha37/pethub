import jwt from "jsonwebtoken";

export function verifyToken(req) {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) return null;

    const token = authHeader.split(" ")[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
        return decoded;
    } catch (err) {
        return null;
    }
}

export function isAdmin(user) {
    return user && (user.role === 'ADMIN' || user.role === 'SUPERADMIN');
}
