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

    // Honeypot
    if (formData.get('website')) {
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
      setStatus(response.ok ? 'success' : 'error')
      if (response.ok) form.reset()
    } catch {
      setStatus('error')
    } finally {
      setPending(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="absolute -left-[9999px] h-0 w-0 opacity-0"
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

      {status === 'success' ? <p className="text-sm text-success">{labels.success}</p> : null}
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
