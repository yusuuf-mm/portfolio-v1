import { NextResponse } from 'next/server'

export async function GET() {
  const url = process.env.RESUME_S3_URL

  if (!url) {
    return NextResponse.json({ error: 'Not configured' }, { status: 404 })
  }

  try {
    const res = await fetch(url)
    const buf = await res.arrayBuffer()
    const headers = new Headers()
    headers.set('Content-Type', 'application/pdf')
    headers.set('Content-Disposition', 'attachment; filename=Yusuf_Muhammad_Musa_CV.pdf')
    headers.set('Cache-Control', 'public, max-age=86400')
    return new NextResponse(buf, { headers })
  } catch (err) {
    console.error('Resume fetch error:', err)
    return NextResponse.json({ error: 'Failed to fetch resume' }, { status: 500 })
  }
}
