export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <h3 className="text-2xl font-bold text-primary mb-6">PetHub</h3>
            <p className="text-gray-400 leading-relaxed">
              Connecting pets with loving homes. Find your new best friend today and give them the life they deserve.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-6 text-white">Quick Links</h4>
            <ul className="space-y-3">
              <li><a href="/pets" className="text-gray-400 hover:text-primary transition">Adopt a Pet</a></li>
              <li><a href="/shop" className="text-gray-400 hover:text-primary transition">Pet Shop</a></li>
              <li><a href="/care" className="text-gray-400 hover:text-primary transition">Nearby Care</a></li>
              <li><a href="/faq" className="text-gray-400 hover:text-primary transition">FAQ</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-6 text-white">Contact Us</h4>
            <p className="text-gray-400 mb-2">support@pethub.com</p>
            <p className="text-gray-400">+1 (555) 123-4567</p>
            <div className="mt-6 flex space-x-4">
              {/* Social Icons Placeholder */}
              <div className="w-8 h-8 bg-gray-800 rounded-full hover:bg-primary transition cursor-pointer"></div>
              <div className="w-8 h-8 bg-gray-800 rounded-full hover:bg-primary transition cursor-pointer"></div>
              <div className="w-8 h-8 bg-gray-800 rounded-full hover:bg-primary transition cursor-pointer"></div>
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} PetHub. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
