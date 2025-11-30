import { NextResponse } from 'next/server';

export function middleware(request) {
    // Get the token from cookies (if you were using cookies) or check headers
    // Since we are using localStorage for auth in this app (client-side),
    // middleware (server-side) cannot directly access localStorage.
    // However, for a robust app, we should use cookies.
    // Given the current architecture uses localStorage and context, 
    // true server-side protection requires cookies.

    // BUT, the user asked to "make all pages and routes protected".
    // Since we are using client-side auth (localStorage), we can't easily check auth in middleware without cookies.
    // A common pattern with Next.js + Client Auth is to check in a client component layout or HOC.
    // OR we can rely on the client-side checks we already have in some pages, but the user wants "proper auth".

    // RE-EVALUATION: The current auth implementation uses `localStorage` which is CLIENT-SIDE ONLY.
    // Middleware runs on the SERVER (Edge). It CANNOT see localStorage.
    // To implement "proper auth" as requested, we would need to switch to Cookies.
    // However, switching to Cookies is a large refactor.
    // The user asked to "fix the tables" and "protect routes".

    // STRATEGY: 
    // 1. I will implement a client-side protection wrapper (HOC) or use the existing AuthContext to redirect.
    // 2. Middleware is useless for localStorage auth.
    // 3. I will add a `ProtectedRoute` component or update `AuthContext` to handle redirects globally?
    //    No, the best way with current setup is to check in `layout.js` or individual pages.
    //    Actually, I can make a `components/ProtectedRoute.jsx` and wrap the protected pages.

    // WAIT, the user specifically asked for "proper auth (role)".
    // Let's stick to the plan but adapt. Since I cannot use middleware effectively with localStorage,
    // I will implement a Client-Side Route Guard component that checks auth state and redirects.

    return NextResponse.next();
}

export const config = {
    matcher: ['/pets/:path*', '/shop/:path*', '/care/:path*', '/cart/:path*', '/dashboard/:path*'],
};
