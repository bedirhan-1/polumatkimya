import {NextResponse} from 'next/server'

type ContactPayload = {
  locale?: string
  name?: string
  email?: string
  phone?: string
  company?: string
  message?: string
  consent?: boolean
}

export async function POST(request: Request) {
  let body: ContactPayload
  try {
    body = (await request.json()) as ContactPayload
  } catch {
    return NextResponse.json({ok: false}, {status: 400})
  }

  if (!body.name || !body.email || !body.message || !body.consent) {
    return NextResponse.json({ok: false}, {status: 400})
  }

  // Provider wiring (email/CRM) lands with Stage 8 security hardening.
  // Accept valid payloads so the UI flow can be exercised locally.
  return NextResponse.json({ok: true})
}
