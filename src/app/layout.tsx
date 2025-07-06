import './globals.css'
import { Inter } from 'next/font/google'
import type { Metadata } from 'next'
import SessionWrapper from '@/components/SessionWrapper'
import Navbar from '@/components/Navbar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'My Crypto Exchange',
  description: 'Track and simulate crypto trading',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionWrapper>
          <Navbar />
          <div className="p-6">{children}</div>
        </SessionWrapper>
      </body>
    </html>
  )
}
