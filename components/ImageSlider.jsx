"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

const slides = [
    {
        id: 1,
        image: "https://images.unsplash.com/photo-1450778869180-41d0601e046e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
        title: "Find Your New Best Friend",
        subtitle: "Thousands of pets are waiting for a loving home.",
        cta: "Adopt Now",
        link: "/pets"
    },
    {
        id: 2,
        image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
        title: "Give Them a Second Chance",
        subtitle: "Adopt, don't shop. Save a life today.",
        cta: "View Pets",
        link: "/pets"
    },
    {
        id: 3,
        image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
        title: "Care for Your Companion",
        subtitle: "Find the best vets and parks near you.",
        cta: "Find Care",
        link: "/care"
    }
];

export default function ImageSlider() {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="relative h-[600px] w-full overflow-hidden">
            {slides.map((slide, index) => (
                <div
                    key={slide.id}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === current ? "opacity-100" : "opacity-0"
                        }`}
                >
                    {/* Image Overlay */}
                    <div className="absolute inset-0 bg-black/40 z-10" />
                    <img
                        src={slide.image}
                        alt={slide.title}
                        className="w-full h-full object-cover"
                    />

                    {/* Content */}
                    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center text-white px-4">
                        <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight drop-shadow-lg">
                            {slide.title}
                        </h1>
                        <p className="text-xl md:text-2xl mb-8 max-w-2xl drop-shadow-md font-light">
                            {slide.subtitle}
                        </p>
                        <Link
                            href={slide.link}
                            className="bg-[#0D9488] hover:bg-[#0F766E] text-white px-8 py-4 rounded-full font-bold text-lg transition-transform transform hover:scale-105 shadow-lg"
                        >
                            {slide.cta}
                        </Link>
                    </div>
                </div>
            ))}

            {/* Dots */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30 flex space-x-3">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrent(index)}
                        className={`w-3 h-3 rounded-full transition-all ${index === current ? "bg-white w-8" : "bg-white/50 hover:bg-white/80"
                            }`}
                    />
                ))}
            </div>
        </div>
    );
}
