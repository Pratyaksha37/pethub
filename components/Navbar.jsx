'use client'

import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'

export default function Navbar() {
  const router = useRouter()
  const pathname = usePathname()

  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState(null)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setHydrated(true)

    const loadUser = () => {
      const stored = localStorage.getItem("user")
      if (stored) setUser(JSON.parse(stored))
      else setUser(null)
    }

    loadUser()

    window.addEventListener("auth-change", loadUser)

    return () => window.removeEventListener("auth-change", loadUser)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.dispatchEvent(new Event("auth-change"))
    setIsOpen(false)
    router.push('/')
  }

  if (!hydrated) return null

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">

          <Link href="/" className="text-2xl font-bold text-primary">
            🐾 PetHub
          </Link>

          <div className="hidden md:flex space-x-6">
            {['/home','/adopt','/shop','/connect','/faq'].map((path, i) => {
              const names = ['Home','Adopt','Shop','Connect','FAQ']
              return (
                <Link
                  key={path}
                  href={path}
                  className={`text-gray-700 hover:text-primary transition ${
                    pathname === path ? 'text-primary font-medium' : ''
                  }`}
                >
                  {names[i]}
                </Link>
              )
            })}
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <button
                onClick={handleLogout}
                className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition"
              >
                Logout
              </button>
            ) : (
              <>
                <Link href="/login" className="text-gray-700 hover:text-primary transition">
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-gray-700 hover:text-primary"
          >
            {isOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                   strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                   strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round"
                      d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>

        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 px-4 py-2 space-y-2">
          {['/home','/adopt','/shop','/connect','/faq'].map((path, i) => {
            const names = ['Home','Adopt','Shop','Connect','FAQ']
            return (
              <Link
                key={path}
                href={path}
                onClick={() => setIsOpen(false)}
                className={`block text-gray-700 py-2 hover:text-primary transition ${
                  pathname === path ? 'text-primary font-medium' : ''
                }`}
              >
                {names[i]}
              </Link>
            )
          })}

          <div className="border-t pt-2">
            {user ? (
              <button
                onClick={handleLogout}
                className="w-full bg-primary text-white py-2 rounded-lg hover:bg-opacity-90"
              >
                Logout
              </button>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="block text-gray-700 py-2 hover:text-primary transition"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setIsOpen(false)}
                  className="block bg-primary text-white text-center py-2 rounded-lg hover:bg-opacity-90"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}