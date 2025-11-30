import { useCart } from "@/context/CartContext";

export default function ShopCard({ item }) {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart({ ...item, type: 'product' });
    alert(`${item.name} added to cart!`);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl border border-gray-100 group">
      <div className="relative h-64 overflow-hidden">
        <img
          src={item.imageUrl}
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {item.inStock ? (
          <div className="absolute top-3 right-3 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
            In Stock
          </div>
        ) : (
          <div className="absolute top-3 right-3 bg-gray-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
            Out of Stock
          </div>
        )}
      </div>
      <div className="p-5">
        <p className="text-primary font-semibold text-xs mb-2 uppercase tracking-wide">{item.category}</p>
        <h3 className="text-xl font-bold text-gray-900 mb-2">{item.name}</h3>
        <p className="text-gray-500 text-sm mb-4 line-clamp-2">{item.description}</p>

        <div className="flex justify-between items-center pt-4 border-t border-gray-100">
          <span className="text-2xl font-bold text-gray-900">
            ${item.price.toFixed(2)}
          </span>
          <button
            onClick={handleAddToCart}
            disabled={!item.inStock}
            className={`px-4 py-2 rounded-full font-semibold text-sm transition shadow-md hover:shadow-lg transform active:scale-95 ${item.inStock
                ? "bg-primary text-white hover:bg-primary-dark"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
          >
            {item.inStock ? "Add to Cart" : "Out of Stock"}
          </button>
        </div>
      </div>
    </div>
  );
}
