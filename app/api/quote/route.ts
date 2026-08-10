import {NextResponse} from 'next/server'

type QuotePayload = {
  locale?: string
  type?: string
  name?: string
  email?: string
  phone?: string
  company?: string
  brandName?: string
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

  const isPrivateLabel = body.type === 'private-label'
  if (!body.name || !body.email || !body.message || !body.consent) {
    return NextResponse.json({ok: false}, {status: 400})
  }
  if (isPrivateLabel && !body.brandName) {
    return NextResponse.json({ok: false}, {status: 400})
  }

  return NextResponse.json({ok: true})
}
