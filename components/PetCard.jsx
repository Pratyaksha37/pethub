import Link from "next/link";

export default function PetCard({ pet, onClick }) {
  const CardContent = () => (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl border border-gray-100 group h-full flex flex-col">
      <div className="relative h-64 overflow-hidden">
        <img
          src={pet.image || "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=800&q=80"}
          alt={pet.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-3 right-3">
          <span className={`px-3 py-1 rounded-full text-xs font-bold text-white shadow-sm ${pet.status === 'AVAILABLE' ? 'bg-green-500' : 'bg-gray-500'} `}>
            {pet.status}
          </span>
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
          <h3 className="text-xl font-bold text-white">{pet.name}</h3>
        </div>
      </div>
      <div className="p-5 flex-grow">
        <p className="text-primary font-semibold text-sm mb-3 uppercase tracking-wide">{pet.breed}</p>

        <div className="flex justify-between items-center text-sm text-gray-500 border-t border-gray-100 pt-3">
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            {pet.age}
          </span>
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
            {pet.size}
          </span>
        </div>
      </div>
    </div>
  );

  if (onClick) {
    return <div onClick={() => onClick(pet)}>{CardContent()}</div>;
  }

  return (
    <Link href={`/pets/${pet.id}`}>
      {CardContent()}
    </Link>
  );
}
