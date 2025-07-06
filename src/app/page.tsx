'use client'

import { useSession, signIn, signOut } from 'next-auth/react'

export const dynamic = 'force-dynamic'
// export const revalidate = 0 //

export default function Home() {
  const { data: session, status } = useSession()

  if (status === 'loading') return <p>Loading...</p>

  if (!session) {
    return (
      <main>
        <h1>Please sign in</h1>
        <button onClick={() => signIn('github')}>Sign in with GitHub</button>
      </main>
    )
  }

  return (
    <main>
      <h1>Welcome, {session.user?.name}</h1>
      <button onClick={() => signOut()}>Sign out</button>
    </main>
  )
}
