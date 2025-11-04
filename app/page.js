// app/page.jsx
"use client";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-6">PetHub</h1>
      <p className="text-lg mb-8 text-gray-700">
        Welcome!!
      </p>
      <div className="flex gap-4">
        <Link href="/signup">
          <button className="bg-blue-600 text-white px-5 py-2 rounded">Sign Up</button>
        </Link>
        <Link href="/login">
          <button className="bg-green-600 text-white px-5 py-2 rounded">Log In</button>
        </Link>
      </div>
      <div className="mt-10 flex gap-4">
        <Link href="/adopt">
          <button className="border px-4 py-2 rounded">Adopt a Pet</button>
        </Link>
        <Link href="/shop">
          <button className="border px-4 py-2 rounded">Shop</button>
        </Link>
        <Link href="/connect">
          <button className="border px-4 py-2 rounded">Connect</button>
        </Link>
        <Link href="/faq">
          <button className="border px-4 py-2 rounded">FAQ</button>
        </Link>
      </div>
    </div>
  );
}
