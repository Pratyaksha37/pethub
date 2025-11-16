'use client'

import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-[#d57752] text-white">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-2xl font-bold mb-2">🐾 PetHub</h3>
          <p className="text-white/80">
            Your all-in-one pet companion platform — adopt, shop, and care for your furry friends with ease.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-white/80">
            <li><Link href="/adopt" className="hover:text-primary">Adopt</Link></li>
            <li><Link href="/shop" className="hover:text-primary">Shop</Link></li>
            <li><Link href="/connect" className="hover:text-primary">Connect</Link></li>
            <li><Link href="/faq" className="hover:text-primary">FAQ</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">Contact</h3>
          <p className="text-white/80">
            123 Pet Street<br/>New Delhi, India<br/>
            Email: info@pethub.com<br/>
            Phone: +91 98765 43210
          </p>
        </div>
      </div>
    </footer>
  )
}
