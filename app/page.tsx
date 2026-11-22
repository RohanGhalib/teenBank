// app/page.tsx
import { createClient } from '@/lib/supabase/server'
import {Suspense} from 'react'

async function UserStatus() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <p className="mt-4">
      {user ? (
        `Welcome back, ${user.email}`
      ) : (
        <>
          Please{' '}
          <a className="text-blue-500 underline" href="/login">log in</a>
          {' '}or{' '}
          <a className="text-blue-500 underline" href="/signup">sign up</a>
          {' '}to continue.
        </>
      )}
    </p>
  )
}
export default async function Home() {

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-3xl font-bold">teenBank Platform</h1>
      <Suspense fallback={<p className="mt-4">Loading...</p>}>
        <UserStatus />
      </Suspense>
    </main>
  )
}