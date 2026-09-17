import {Resend} from 'resend'

import {getContactToEmail, getResendApiKey, getResendFrom} from '@/lib/email/env'
import {isLocale, type Locale} from '@/lib/i18n/locales'

export function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

export function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

type ConfirmationCopy = {
  subject: string
  greeting: (name: string) => string
  body: string
  closing: string
  signature: string
}

const confirmationCopy: Record<Locale, ConfirmationCopy> = {
  tr: {
    subject: 'Talebinizi aldık — Polumat Kimya',
    greeting: (name) => `Merhaba ${name},`,
    body: 'Mesajınız bize ulaştı. Ekibimiz en kısa sürede sizinle iletişime geçecek.',
    closing: 'İlginiz için teşekkür ederiz.',
    signature: 'Polumat Kimya',
  },
  en: {
    subject: 'We received your request — Polumat Kimya',
    greeting: (name) => `Hello ${name},`,
    body: 'Your message has reached us. Our team will get back to you as soon as possible.',
    closing: 'Thank you for your interest.',
    signature: 'Polumat Kimya',
  },
  ar: {
    subject: 'استلمنا طلبك — Polumat Kimya',
    greeting: (name) => `مرحبًا ${name}،`,
    body: 'وصلتنا رسالتك. سيتواصل معك فريقنا في أقرب وقت ممكن.',
    closing: 'شكرًا لاهتمامك.',
    signature: 'Polumat Kimya',
  },
}

function resolveLocale(value: string | undefined): Locale {
  return value && isLocale(value) ? value : 'tr'
}

type SendFormEmailInput = {
  subject: string
  replyTo: string
  visitorName: string
  locale?: string
  idempotencyKey: string
  rows: Array<{label: string; value: string}>
  message: string
}

export async function sendFormEmail({
  subject,
  replyTo,
  visitorName,
  locale,
  idempotencyKey,
  rows,
  message,
}: SendFormEmailInput) {
  const apiKey = getResendApiKey()
  if (!apiKey) {
    return {ok: false as const, error: 'Email is not configured'}
  }

  const resend = new Resend(apiKey)
  const to = getContactToEmail()
  const from = getResendFrom()

  const rowsHtml = rows
    .filter((row) => row.value.trim())
    .map(
      (row) =>
        `<tr><td style="padding:6px 12px 6px 0;color:#64748b;vertical-align:top;">${escapeHtml(row.label)}</td><td style="padding:6px 0;color:#0f172a;">${escapeHtml(row.value)}</td></tr>`,
    )
    .join('')

  const html = `
    <div style="font-family:ui-sans-serif,system-ui,sans-serif;font-size:15px;line-height:1.5;color:#0f172a;">
      <p style="margin:0 0 16px;">Yeni form gönderimi — Polumat Kimya web sitesi</p>
      <table style="border-collapse:collapse;margin:0 0 20px;">${rowsHtml}</table>
      <p style="margin:0 0 8px;color:#64748b;">Mesaj</p>
      <p style="margin:0;white-space:pre-wrap;">${escapeHtml(message)}</p>
    </div>
  `

  const text = [
    'Yeni form gönderimi — Polumat Kimya web sitesi',
    '',
    ...rows.filter((row) => row.value.trim()).map((row) => `${row.label}: ${row.value}`),
    '',
    'Mesaj:',
    message,
  ].join('\n')

  const {data, error} = await resend.emails.send(
    {
      from,
      to: [to],
      replyTo,
      subject,
      html,
      text,
    },
    {idempotencyKey},
  )

  if (error) {
    console.error('[email] Resend error (inbox):', error.message)
    return {ok: false as const, error: error.message}
  }

  const confirmation = confirmationCopy[resolveLocale(locale)]
  const greeting = confirmation.greeting(visitorName)
  const confirmationHtml = `
    <div style="font-family:ui-sans-serif,system-ui,sans-serif;font-size:15px;line-height:1.6;color:#0f172a;">
      <p style="margin:0 0 12px;">${escapeHtml(greeting)}</p>
      <p style="margin:0 0 12px;">${escapeHtml(confirmation.body)}</p>
      <p style="margin:0 0 20px;">${escapeHtml(confirmation.closing)}</p>
      <p style="margin:0;color:#64748b;">${escapeHtml(confirmation.signature)}</p>
    </div>
  `
  const confirmationText = [
    greeting,
    '',
    confirmation.body,
    '',
    confirmation.closing,
    '',
    confirmation.signature,
  ].join('\n')

  const {error: confirmationError} = await resend.emails.send(
    {
      from,
      to: [replyTo],
      subject: confirmation.subject,
      html: confirmationHtml,
      text: confirmationText,
    },
    {idempotencyKey: `${idempotencyKey}/ack`},
  )

  if (confirmationError) {
    // Inbox mail already sent — don't fail the form; log for ops.
    console.error('[email] Resend error (visitor ack):', confirmationError.message)
  }

  return {ok: true as const, id: data?.id}
}
