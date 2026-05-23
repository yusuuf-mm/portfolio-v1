import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getRatelimit } from '@/lib/redis'
import { sendEmail } from '@/lib/resend'

const schema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email().max(200),
  message: z.string().min(1).max(5000),
})

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || 'unknown'

  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    const rl = getRatelimit()
    const result = await rl.limit(ip).catch(() => ({ success: true }))
    if (!result.success) {
      return NextResponse.json({ error: 'Too many requests.' }, { status: 429 })
    }
  }

  const body = await req.json().catch(() => null)
  if (!body) {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 })
  }

  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })
  }

  const { name, email, message } = parsed.data

  const sent = await sendEmail({ name, email, message }).catch((err: unknown) => {
    console.error('Resend error:', err)
    return err instanceof Error ? err : new Error('Unknown email error')
  })

  if (sent instanceof Error) {
    return NextResponse.json({ error: sent.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
