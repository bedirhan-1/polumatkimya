import {NextResponse} from 'next/server'

import {isValidEmail, sendFormEmail} from '@/lib/email/send'

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
  website?: string
  company_url_hp?: string
}

function asTrimmedString(value: unknown) {
  return typeof value === 'string' ? value.trim() : ''
}

export async function POST(request: Request) {
  let body: QuotePayload
  try {
    body = (await request.json()) as QuotePayload
  } catch {
    return NextResponse.json({ok: false}, {status: 400})
  }

  if (asTrimmedString(body.website) || asTrimmedString(body.company_url_hp)) {
    return NextResponse.json({ok: true})
  }

  const isPrivateLabel = body.type === 'private-label'
  const name = asTrimmedString(body.name)
  const email = asTrimmedString(body.email)
  const phone = asTrimmedString(body.phone)
  const company = asTrimmedString(body.company)
  const brandName = asTrimmedString(body.brandName)
  const productInterest = asTrimmedString(body.productInterest)
  const message = asTrimmedString(body.message)
  const locale = asTrimmedString(body.locale) || 'tr'

  if (!name || !email || !message || !body.consent || !isValidEmail(email)) {
    return NextResponse.json({ok: false}, {status: 400})
  }
  if (isPrivateLabel && !brandName) {
    return NextResponse.json({ok: false}, {status: 400})
  }

  const kind = isPrivateLabel ? 'Private Label' : 'Teklif'
  const result = await sendFormEmail({
    subject: `[${kind}] ${name}${brandName ? ` — ${brandName}` : ''}`,
    replyTo: email,
    visitorName: name,
    locale,
    idempotencyKey: `quote/${crypto.randomUUID()}`,
    rows: [
      {label: 'Tür', value: kind},
      {label: 'Ad', value: name},
      {label: 'E-posta', value: email},
      {label: 'Telefon', value: phone},
      {label: 'Firma', value: company},
      {label: 'Marka', value: brandName},
      {label: 'Ürün ilgisi', value: productInterest},
      {label: 'Dil', value: locale},
    ],
    message,
  })

  if (!result.ok) {
    return NextResponse.json({ok: false}, {status: 502})
  }

  return NextResponse.json({ok: true})
}
