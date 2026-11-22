// app/dashboard/actions.ts
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function sendMoney(formData: FormData) {
  const receiverEmail = formData.get('receiverEmail') as string
  const amountStr = formData.get('amount') as string
  const amount = parseFloat(amountStr)

  if (!receiverEmail || isNaN(amount) || amount <= 0) {
    return redirect('/dashboard?error=' + encodeURIComponent('Invalid email or amount.'))
  }

  const supabase = await createClient()

  // Execute the atomic PostgreSQL transfer_money function
  const { error } = await supabase.rpc('transfer_money', {
    receiver_email: receiverEmail,
    transfer_amount: amount,
  })

  if (error) {
    return redirect('/dashboard?error=' + encodeURIComponent(error.message))
  }

  revalidatePath('/dashboard')
  return redirect('/dashboard?success=' + encodeURIComponent(`Successfully sent $${amount.toFixed(2)} to ${receiverEmail}`))
}