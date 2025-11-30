"use client";
import { useCart } from "@/context/CartContext";
import Link from "next/link";
import { useState } from "react";
import AuthGuard from "@/components/AuthGuard";

export default function CartPage() {
    const { cart, removeFromCart, updateQuantity, clearCart, cartTotal } = useCart();
    const [isCheckingOut, setIsCheckingOut] = useState(false);

    const handleCheckout = () => {
        setIsCheckingOut(true);
        setTimeout(() => {
            alert("Checkout successful! Thank you for your purchase.");
            clearCart();
            setIsCheckingOut(false);
        }, 2000);
    };

    if (cart.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 py-20 px-4 flex flex-col items-center justify-center">
                <div className="text-center">
                    <svg className="w-24 h-24 text-gray-300 mx-auto mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
                    <p className="text-gray-500 mb-8 max-w-md mx-auto">
                        Looks like you haven't added anything to your cart yet. Browse our shop to find amazing products for your pet.
                    </p>
                    <Link href="/shop" className="bg-primary text-white px-8 py-3 rounded-full font-bold hover:bg-primary-dark transition shadow-lg">
                        Start Shopping
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <AuthGuard>
            <div className="min-h-screen bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Cart Items */}
                        <div className="lg:col-span-2 space-y-4">
                            {cart.map((item) => (
                                <div key={`${item.id} -${item.type} `} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col sm:flex-row items-center gap-6">
                                    <img src={item.imageUrl || item.image} alt={item.name} className="w-24 h-24 object-cover rounded-lg" />

                                    <div className="flex-1 text-center sm:text-left">
                                        <h3 className="text-lg font-bold text-gray-900">{item.name}</h3>
                                        <p className="text-gray-500 text-sm mb-2">{item.category || item.breed}</p>
                                        <p className="text-primary font-bold">${item.price?.toFixed(2) || "0.00"}</p>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center border rounded-lg">
                                            <button
                                                onClick={() => updateQuantity(item.id, item.type, item.quantity - 1)}
                                                className="px-3 py-1 text-gray-600 hover:bg-gray-100 transition"
                                                disabled={item.quantity <= 1}
                                            >
                                                -
                                            </button>
                                            <span className="px-3 py-1 font-medium text-gray-900">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.type, item.quantity + 1)}
                                                className="px-3 py-1 text-gray-600 hover:bg-gray-100 transition"
                                            >
                                                +
                                            </button>
                                        </div>
                                        <button
                                            onClick={() => removeFromCart(item.id, item.type)}
                                            className="text-red-500 hover:text-red-700 transition p-2"
                                        >
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24">
                                <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

                                <div className="space-y-4 mb-6">
                                    <div className="flex justify-between text-gray-600">
                                        <span>Subtotal</span>
                                        <span>${cartTotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>Shipping</span>
                                        <span>Free</span>
                                    </div>
                                    <div className="border-t pt-4 flex justify-between text-lg font-bold text-gray-900">
                                        <span>Total</span>
                                        <span>${cartTotal.toFixed(2)}</span>
                                    </div>
                                </div>

                                <button
                                    onClick={handleCheckout}
                                    disabled={isCheckingOut}
                                    className={"w-full py-4 rounded-full font-bold text-lg shadow-lg transition transform hover:-translate-y-1 " +
                                        (isCheckingOut
                                            ? "bg-gray-400 cursor-not-allowed"
                                            : "bg-primary text-white hover:bg-primary-dark")
                                    }
                                >
                                    {isCheckingOut ? "Processing..." : "Checkout"}
                                </button>

                                <p className="text-xs text-center text-gray-500 mt-4">
                                    Secure Checkout • Free Shipping • 30-Day Returns
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthGuard>
    );
}
