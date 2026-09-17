import {NextResponse} from 'next/server'

import {isValidEmail, sendFormEmail} from '@/lib/email/send'

type ContactPayload = {
  locale?: string
  name?: string
  email?: string
  phone?: string
  company?: string
  message?: string
  consent?: boolean
  website?: string
  company_url_hp?: string
}

function asTrimmedString(value: unknown) {
  return typeof value === 'string' ? value.trim() : ''
}

export async function POST(request: Request) {
  let body: ContactPayload
  try {
    body = (await request.json()) as ContactPayload
  } catch {
    return NextResponse.json({ok: false}, {status: 400})
  }

  // Honeypot — bots fill hidden fields; pretend success.
  if (asTrimmedString(body.website) || asTrimmedString(body.company_url_hp)) {
    return NextResponse.json({ok: true})
  }

  const name = asTrimmedString(body.name)
  const email = asTrimmedString(body.email)
  const phone = asTrimmedString(body.phone)
  const company = asTrimmedString(body.company)
  const message = asTrimmedString(body.message)
  const locale = asTrimmedString(body.locale) || 'tr'

  if (!name || !email || !message || !body.consent || !isValidEmail(email)) {
    return NextResponse.json({ok: false}, {status: 400})
  }

  const result = await sendFormEmail({
    subject: `[İletişim] ${name}`,
    replyTo: email,
    visitorName: name,
    locale,
    idempotencyKey: `contact/${crypto.randomUUID()}`,
    rows: [
      {label: 'Ad', value: name},
      {label: 'E-posta', value: email},
      {label: 'Telefon', value: phone},
      {label: 'Firma', value: company},
      {label: 'Dil', value: locale},
    ],
    message,
  })

  if (!result.ok) {
    return NextResponse.json({ok: false}, {status: 502})
  }

  return NextResponse.json({ok: true})
}
