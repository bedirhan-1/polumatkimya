import {NextResponse} from 'next/server'

type QuotePayload = {
  locale?: string
  name?: string
  email?: string
  phone?: string
  company?: string
  productInterest?: string
  message?: string
  consent?: boolean
}

export async function POST(request: Request) {
  let body: QuotePayload
  try {
    body = (await request.json()) as QuotePayload
  } catch {
    return NextResponse.json({ok: false}, {status: 400})
  }

  if (!body.name || !body.email || !body.message || !body.consent) {
    return NextResponse.json({ok: false}, {status: 400})
  }

  return NextResponse.json({ok: true})
}
