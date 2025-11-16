'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function HomePage() {

  return (
    <div className="min-h-screen">
      <div className="relative h-[500px] overflow-hidden bg-[#d57752]">
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <section className="mb-16">
          <h2 className="text-4xl font-bold text-center mb-4">Welcome to PetHub</h2>
          <p className="text-gray-600 text-center max-w-3xl mx-auto mb-12">
            Your one-stop platform for pet adoption, shopping, and connecting with pet care services.
            Find your perfect companion and give them a loving home.
          </p>
        </section>

        <section className="mb-16">
          <div className="rounded-xl p-8 text-black text-center">
            <h3 className="text-3xl font-bold mb-4">Adopt a Pet</h3>
            <p className="mb-6">
              Browse our available pets and find your new best friend. Every pet deserves a loving home.
            </p>
            <Link
              href="/adopt"
              className="bg-white text-primary px-6 py-3 rounded-lg hover:bg-gray-100 transition inline-block"
            >
              View Available Pets
            </Link>
          </div>
        </section>

        <section className="mb-16">
          <div className="rounded-xl p-8 text-black text-center">
            <h3 className="text-3xl font-bold mb-4">Shop Pet Accessories</h3>
            <p className="mb-6">
              Get everything your pet needs - from food and toys to beds and grooming supplies.
            </p>
            <Link
              href="/shop"
              className="bg-white text-primary px-6 py-3 rounded-lg hover:bg-gray-100 transition inline-block"
            >
              Browse Shop
            </Link>
          </div>
        </section>

        <section className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-2xl font-bold mb-4">Connect with Services</h3>
            <p className="text-gray-600 mb-4">
              Find nearby veterinarians, groomers, trainers, and boarding facilities for your pet.
            </p>
            <Link
              href="/connect"
              className="text-secondary hover:underline"
            >
              Find Services →
            </Link>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-2xl font-bold mb-4">Frequently Asked Questions</h3>
            <p className="text-gray-600 mb-4">
              Get answers to common questions about pet adoption, care, and our platform.
            </p>
            <Link
              href="/faq"
              className="text-secondary hover:underline"
            >
              Read FAQs →
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
