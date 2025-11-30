import Link from "next/link";
import ImageSlider from "@/components/ImageSlider";

export default function Home() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <ImageSlider />

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-primary font-semibold tracking-wide uppercase text-sm">Why Choose PetHub?</h2>
            <h3 className="mt-2 text-4xl font-extrabold text-gray-900 sm:text-5xl">
              Everything for your furry friend
            </h3>
            <p className="mt-4 text-xl text-gray-500 max-w-2xl mx-auto">
              We make it easy to find, adopt, and care for your pets with our comprehensive platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <Link href="/pets" className="h-full block">
              <FeatureCard
                icon={
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                }
                title="Adopt Love"
                description="Find your perfect match from thousands of available pets."
              />
            </Link>
            <Link href="/care" className="h-full block">
              <FeatureCard
                icon={
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                }
                title="Nearby Care"
                description="Instantly locate the best veterinarians, pet stores, and parks in your neighborhood."
              />
            </Link>
            <Link href="/shop" className="h-full block">
              <FeatureCard
                icon={
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                }
                title="Pet Shop"
                description="Get everything your pet needs - from food and toys to beds and grooming supplies."
              />
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-primary py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            Ready to meet your new best friend?
          </h2>
          <p className="mt-4 text-xl text-teal-100 max-w-2xl mx-auto">
            Browse our listings and start your adoption journey today.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link
              href="/pets"
              className="bg-white text-primary px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:bg-gray-50 transition-transform transform hover:-translate-y-1"
            >
              Browse Pets
            </Link>
            <Link
              href="/signup"
              className="bg-primary-dark text-white border border-teal-500 px-8 py-4 rounded-full font-bold text-lg hover:bg-teal-800 transition-transform transform hover:-translate-y-1"
            >
              Create Account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 h-full flex flex-col">
      <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-dark rounded-2xl flex items-center justify-center mb-6 shadow-md transform -rotate-3 flex-shrink-0">
        {icon}
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-500 leading-relaxed flex-grow">{description}</p>
    </div>
  );
}
