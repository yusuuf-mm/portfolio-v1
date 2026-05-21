import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getRatelimit } from '@/lib/redis'
import { sendEmail } from '@/lib/ses'

const contactSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Invalid email').max(200),
  message: z.string().min(1, 'Message is required').max(5000),
})

export async function POST(request: NextRequest) {
  try {
    const ip =
      request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'

    // Rate limiting — graceful fallback if Redis not configured
    if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
      try {
        const { success } = await getRatelimit().limit(ip)
        if (!success) {
          return NextResponse.json(
            { error: 'Too many requests. Try again later.' },
            { status: 429 }
          )
        }
      } catch {
        // Rate limiter failed — allow request through
      }
    }

    const body = await request.json()
    const parsed = contactSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })
    }

    const { name, email, message } = parsed.data
    await sendEmail({ name, email, message })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 })
  }
}
