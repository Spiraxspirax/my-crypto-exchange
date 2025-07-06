'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'

const navItems = [
  { name: 'Dashboard', href: '/dashboard' },
  { name: 'Markets', href: '/markets' },
  { name: 'Portfolio', href: '/portfolio' },
  { name: 'History', href: '/history' },
]

export default function Navbar() {
  const pathname = usePathname()

  return (
    <nav className="bg-gray-900 text-white px-6 py-4 flex items-center justify-between shadow-md">
      <h1 className="text-xl font-bold">💱 MyCrypto</h1>
      <ul className="flex gap-6">
        {navItems.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className={clsx(
                'hover:text-yellow-400 transition-colors',
                pathname === item.href && 'text-yellow-400 font-semibold'
              )}
            >
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
