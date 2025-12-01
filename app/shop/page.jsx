"use client";
import ShopCard from "@/components/ShopCard";
import AuthGuard from "@/components/AuthGuard";

const products = [
  {
    id: 1,
    name: "Premium Dog Food",
    category: "Food",
    price: 49.99,
    description: "High-quality, grain-free dog food for all breeds. Rich in protein and essential nutrients.",
    imageUrl: "https://images.unsplash.com/photo-1589924691195-41432c84c161?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    inStock: true,
  },
  {
    id: 2,
    name: "Cozy Cat Bed",
    category: "Bedding",
    price: 34.50,
    description: "Ultra-soft and comfortable bed for your feline friend. Machine washable cover.",
    imageUrl: "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    inStock: true,
  },
  {
    id: 3,
    name: "Interactive Dog Toy",
    category: "Toys",
    price: 15.99,
    description: "Durable toy perfect for chewers. Keeps your dog entertained for hours.",
    imageUrl: "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    inStock: true,
  },
  {
    id: 4,
    name: "Cat Scratching Post",
    category: "Furniture",
    price: 45.00,
    description: "Sturdy scratching post with sisal rope. Protects your furniture from scratches.",
    imageUrl: "https://images.unsplash.com/photo-1545249390-6bdfa286032f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    inStock: true,
  },
  {
    id: 5,
    name: "Pet Grooming Kit",
    category: "Grooming",
    price: 29.99,
    description: "Complete set of grooming tools including brush, nail clipper, and shampoo.",
    imageUrl: "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    inStock: false,
  },
  {
    id: 6,
    name: "Automatic Feeder",
    category: "Accessories",
    price: 89.99,
    description: "Programmable feeder to ensure your pet is fed on time, every time.",
    imageUrl: "https://images.unsplash.com/photo-1585846416120-3a7354ed7d65?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    inStock: true,
  }
];

import { useState } from "react";

export default function ShopPage() {
  const [page, setPage] = useState(1);
  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl mb-4">
              Pet Shop
            </h1>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto">
              Quality products for your beloved companions. From food to toys, we have it all.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.slice((page - 1) * 9, page * 9).map((product) => (
              <ShopCard key={product.id} item={product} />
            ))}
          </div>

          {/* Pagination */}
          {products.length > 9 && (
            <div className="flex justify-center mt-12 space-x-2">
              <button
                disabled={page === 1}
                onClick={() => setPage(p => Math.max(1, p - 1))}
                className="px-4 py-2 border rounded-lg disabled:opacity-50 hover:bg-gray-50"
              >
                Previous
              </button>
              <span className="px-4 py-2 text-gray-600 font-medium">Page {page} of {Math.ceil(products.length / 9)}</span>
              <button
                disabled={page === Math.ceil(products.length / 9)}
                onClick={() => setPage(p => Math.min(Math.ceil(products.length / 9), p + 1))}
                className="px-4 py-2 border rounded-lg disabled:opacity-50 hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </AuthGuard>
  );
}
