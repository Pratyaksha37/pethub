"use client";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useState } from "react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link href="/" className="text-3xl font-bold text-primary tracking-tight">
              PetHub
            </Link>
            <div className="hidden md:flex space-x-8 ml-12">
              <NavLink href="/">Home</NavLink>
              <NavLink href="/faq">FAQ</NavLink>
              {user && (
                <>
                  <NavLink href="/pets">Adopt</NavLink>
                  <NavLink href="/shop">Shop</NavLink>
                  <NavLink href="/care">Nearby Care</NavLink>
                  <NavLink href="/dashboard">Dashboard</NavLink>
                </>
              )}
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {user && (
              <Link href="/cart" className="relative text-gray-600 hover:text-primary transition p-2">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
            )}
            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-gray-600 font-medium">Hi, {user.name}</span>
                <button
                  onClick={logout}
                  className="text-red-500 hover:text-red-600 font-medium transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link href="/login" className="text-gray-600 hover:text-primary font-medium transition">
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="bg-primary text-white px-5 py-2.5 rounded-full font-medium hover:bg-primary-dark transition shadow-md hover:shadow-lg"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600 p-2">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 absolute w-full shadow-lg">
          <div className="px-4 pt-2 pb-6 space-y-2">
            <MobileNavLink href="/">Home</MobileNavLink>
            <MobileNavLink href="/faq">FAQ</MobileNavLink>
            {user && (
              <>
                <MobileNavLink href="/pets">Adopt</MobileNavLink>
                <MobileNavLink href="/shop">Shop</MobileNavLink>
                <MobileNavLink href="/care">Nearby Care</MobileNavLink>
                <MobileNavLink href="/cart">Cart ({cartCount})</MobileNavLink>
                <MobileNavLink href="/dashboard">Dashboard</MobileNavLink>
              </>
            )}
            <div className="pt-4 border-t border-gray-100 mt-4">
              {user ? (
                <button onClick={logout} className="block w-full text-left px-3 py-2 text-red-500 font-medium">
                  Logout
                </button>
              ) : (
                <div className="space-y-3 px-3">
                  <Link href="/login" className="block text-gray-600 font-medium">Login</Link>
                  <Link href="/signup" className="block text-primary font-bold">Sign Up</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

function NavLink({ href, children }) {
  return (
    <Link href={href} className="text-gray-600 hover:text-primary font-medium transition-colors">
      {children}
    </Link>
  );
}

function MobileNavLink({ href, children }) {
  return (
    <Link href={href} className="block px-3 py-3 text-gray-600 hover:text-primary hover:bg-gray-50 rounded-lg font-medium transition">
      {children}
    </Link>
  );
}