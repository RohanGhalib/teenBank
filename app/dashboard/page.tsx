// app/dashboard/page.tsx
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { connection } from 'next/server'
import { logout } from '../(auth)/actions'
import { sendMoney } from './actions'

export default async function DashboardPage(props: {
  searchParams: Promise<{ error?: string; success?: string }>
}) {
  await connection()
  const searchParams = await props.searchParams
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/signup')

  // Fetch Wallet Balance
  const { data: wallet } = await supabase
    .from('wallets')
    .select('balance')
    .eq('user_id', user.id)
    .single()

  // Fetch Recent Transactions
  const { data: transactions } = await supabase
    .from('transactions')
    .select('*')
    .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
    .order('created_at', { ascending: false })
    .limit(5)

  return (
    <main className="mx-auto flex min-h-screen max-w-4xl flex-col gap-6 p-6">
      {/* Header */}
      <header className="flex items-center justify-between border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold">teenbank</h1>
          <p className="text-sm text-neutral-500">{user.email}</p>
        </div>
        <form action={logout}>
          <button className="rounded-md border px-3 py-1.5 text-sm font-medium hover:bg-neutral-100">
            Sign Out
          </button>
        </form>
      </header>

      {/* Notifications */}
      {searchParams.error && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">
          {searchParams.error}
        </div>
      )}
      {searchParams.success && (
        <div className="rounded-md bg-green-50 p-3 text-sm text-green-600">
          {searchParams.success}
        </div>
      )}

      {/* Wallet Balance Card */}
      <div className="rounded-2xl bg-black p-6 text-white shadow-lg">
        <p className="text-sm font-medium text-neutral-400">Total Balance</p>
        <h2 className="mt-2 text-4xl font-extrabold">
          ${wallet?.balance ? Number(wallet.balance).toFixed(2) : '0.00'}
        </h2>
      </div>

      {/* Actions & History Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Send Money Form */}
        <div className="rounded-xl border p-5 shadow-sm">
          <h3 className="text-lg font-bold">Send Money</h3>
          <form action={sendMoney} className="mt-4 flex flex-col gap-3">
            <label className="flex flex-col gap-1 text-sm font-medium">
              Recipient Email
              <input
                name="receiverEmail"
                type="email"
                placeholder="friend@example.com"
                required
                className="rounded-md border p-2 text-sm outline-none focus:ring-2 focus:ring-black"
              />
            </label>

            <label className="flex flex-col gap-1 text-sm font-medium">
              Amount ($)
              <input
                name="amount"
                type="number"
                step="0.01"
                min="0.01"
                placeholder="10.00"
                required
                className="rounded-md border p-2 text-sm outline-none focus:ring-2 focus:ring-black"
              />
            </label>

            <button
              type="submit"
              className="mt-2 rounded-md bg-black py-2 text-sm font-medium text-white hover:bg-neutral-800"
            >
              Transfer Funds
            </button>
          </form>
        </div>

        {/* Transaction History */}
        <div className="rounded-xl border p-5 shadow-sm">
          <h3 className="text-lg font-bold">Recent Activity</h3>
          <div className="mt-4 flex flex-col gap-3">
            {transactions && transactions.length > 0 ? (
              transactions.map((tx) => {
                const isSender = tx.sender_id === user.id
                return (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between rounded-lg border p-3 text-sm"
                  >
                    <div>
                      <p className="font-semibold">
                        {isSender ? 'Sent Funds' : 'Received Funds'}
                      </p>
                      <p className="text-xs text-neutral-400">
                        {new Date(tx.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <span
                      className={`font-bold ${
                        isSender ? 'text-red-500' : 'text-green-600'
                      }`}
                    >
                      {isSender ? '-' : '+'}${Number(tx.amount).toFixed(2)}
                    </span>
                  </div>
                )
              })
            ) : (
              <p className="text-sm text-neutral-500">No transactions yet.</p>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}