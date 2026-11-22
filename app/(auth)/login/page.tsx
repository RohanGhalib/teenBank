// app/(auth)/signup/page.tsx
import { Suspense } from 'react'
import { login } from '../actions'

async function ErrorBanner({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams
  if (!error) return null

  return (
    <div className="rounded bg-red-50 p-3 text-sm text-red-600">
      {error}
    </div>
  )
}

export default function LoginPage(props: {
  searchParams: Promise<{ error?: string }>
}) {
  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <form
        action={login}
        className="flex w-full max-w-sm flex-col gap-4 rounded-xl border p-6 shadow-sm"
      >
        <h1 className="text-2xl font-bold">Log in to teenbank</h1>

        <Suspense fallback={null}>
          <ErrorBanner searchParams={props.searchParams} />
        </Suspense>

        <label className="flex flex-col gap-1 text-sm font-medium">
          Email
          <input
            name="email"
            type="email"
            required
            className="rounded-md border p-2 text-base outline-none focus:ring-2 focus:ring-black"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm font-medium">
          Password
          <input
            name="password"
            type="password"
            required
            className="rounded-md border p-2 text-base outline-none focus:ring-2 focus:ring-black"
          />
        </label>

        <button
          type="submit"
          className="mt-2 rounded-md bg-black py-2.5 font-medium text-white hover:bg-neutral-800"
        >
          Sign In
        </button>
      </form>
    </main>
  )
}