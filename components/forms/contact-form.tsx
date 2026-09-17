'use client'

import {useState, type FormEvent} from 'react'

import type {Dictionary} from '@/lib/i18n/get-dictionary'

type ContactFormProps = {
  labels: Dictionary['forms']
  locale: string
}

export function ContactForm({labels, locale}: ContactFormProps) {
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [pending, setPending] = useState(false)

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setPending(true)
    setStatus('idle')

    const form = event.currentTarget
    const formData = new FormData(form)

    // Honeypot — obscure name avoids browser autofill (e.g. "website")
    if (formData.get('company_url_hp')) {
      setPending(false)
      setStatus('success')
      return
    }

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          locale,
          name: formData.get('name'),
          email: formData.get('email'),
          phone: formData.get('phone'),
          company: formData.get('company'),
          message: formData.get('message'),
          consent: formData.get('consent') === 'on',
        }),
      })
      if (response.ok) {
        form.reset()
        setStatus('success')
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    } finally {
      setPending(false)
    }
  }

  if (status === 'success') {
    return (
      <div
        role="status"
        className="flex min-h-64 flex-col items-start justify-center gap-3 border border-border border-s-2 border-s-accent bg-surface/40 px-6 py-10"
      >
        <p className="font-display text-xl text-foreground sm:text-2xl">{labels.successTitle}</p>
        <p className="max-w-md text-sm leading-relaxed text-muted">{labels.success}</p>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="relative flex flex-col gap-4" noValidate>
      <input
        type="text"
        name="company_url_hp"
        tabIndex={-1}
        autoComplete="off"
        defaultValue=""
        className="pointer-events-none absolute h-px w-px overflow-hidden opacity-0"
        aria-hidden="true"
      />

      <Field label={labels.name} name="name" required />
      <Field label={labels.email} name="email" type="email" required dir="ltr" />
      <Field label={labels.phone} name="phone" type="tel" dir="ltr" />
      <Field label={labels.company} name="company" />
      <label className="flex flex-col gap-2 text-sm">
        <span>{labels.message}</span>
        <textarea
          name="message"
          required
          rows={5}
          className="min-h-28 border border-border bg-surface px-3 py-2 text-foreground"
        />
      </label>

      <label className="flex items-start gap-3 text-sm text-muted">
        <input type="checkbox" name="consent" required className="mt-1" />
        <span>{labels.consent}</span>
      </label>

      <button
        type="submit"
        disabled={pending}
        className="inline-flex min-h-11 items-center justify-center bg-accent px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
      >
        {labels.submitContact}
      </button>

      {status === 'error' ? <p className="text-sm text-danger">{labels.error}</p> : null}
    </form>
  )
}

function Field({
  label,
  name,
  type = 'text',
  required,
  dir,
}: {
  label: string
  name: string
  type?: string
  required?: boolean
  dir?: 'ltr' | 'rtl'
}) {
  return (
    <label className="flex flex-col gap-2 text-sm">
      <span>{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        dir={dir}
        className="min-h-11 border border-border bg-surface px-3 py-2 text-foreground"
      />
    </label>
  )
}
