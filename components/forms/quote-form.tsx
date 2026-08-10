'use client'

import {useState, type FormEvent} from 'react'

import type {Dictionary} from '@/lib/i18n/get-dictionary'

type QuoteFormProps = {
  labels: Dictionary['forms']
  locale: string
  defaultProductInterest?: string
  /** When true, shows brand name and posts as a private-label quote. */
  privateLabel?: boolean
}

const fieldClassName =
  'min-h-11 border border-border bg-background px-3 py-2 text-foreground outline-none transition focus:border-accent'

export function QuoteForm({
  labels,
  locale,
  defaultProductInterest,
  privateLabel = false,
}: QuoteFormProps) {
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [pending, setPending] = useState(false)

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setPending(true)
    setStatus('idle')

    const form = event.currentTarget
    const formData = new FormData(form)

    if (formData.get('website')) {
      setPending(false)
      setStatus('success')
      return
    }

    try {
      const response = await fetch('/api/quote', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          locale,
          type: privateLabel ? 'private-label' : 'quote',
          name: formData.get('name'),
          email: formData.get('email'),
          phone: formData.get('phone'),
          company: formData.get('company'),
          brandName: formData.get('brandName'),
          productInterest: formData.get('productInterest'),
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
    <form onSubmit={onSubmit} className="relative flex flex-col gap-5" noValidate>
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="pointer-events-none absolute h-px w-px overflow-hidden opacity-0"
        aria-hidden="true"
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label={labels.name} name="name" required />
        <Field label={labels.email} name="email" type="email" required dir="ltr" />
        <Field label={labels.phone} name="phone" type="tel" dir="ltr" />
        <Field label={labels.company} name="company" />
        {privateLabel ? (
          <Field label={labels.brandName} name="brandName" required />
        ) : null}
        <Field
          label={labels.productInterest}
          name="productInterest"
          defaultValue={
            defaultProductInterest ||
            (privateLabel ? labels.privateLabelInterestDefault : undefined)
          }
        />
      </div>

      <label className="flex flex-col gap-2 text-sm text-muted">
        <span className="font-medium text-foreground">{labels.message}</span>
        <textarea
          name="message"
          required
          rows={5}
          className={`${fieldClassName} min-h-32 resize-y`}
        />
      </label>

      <label className="flex items-start gap-3 text-sm text-muted">
        <input
          type="checkbox"
          name="consent"
          required
          className="mt-1 size-4 accent-[var(--accent)]"
        />
        <span>{labels.consent}</span>
      </label>

      <button
        type="submit"
        disabled={pending}
        className="inline-flex min-h-12 items-center justify-center bg-accent px-6 py-3 text-sm font-semibold tracking-wide text-white transition hover:brightness-110 disabled:opacity-60"
      >
        {privateLabel ? labels.submitPrivateLabel : labels.submitQuote}
      </button>

      {status === 'success' ? (
        <p className="border border-border border-s-2 border-s-accent bg-background/60 px-4 py-3 text-sm text-success">
          {labels.success}
        </p>
      ) : null}
      {status === 'error' ? (
        <p className="border border-border border-s-2 border-s-[var(--danger)] bg-background/60 px-4 py-3 text-sm text-danger">
          {labels.error}
        </p>
      ) : null}
    </form>
  )
}

function Field({
  label,
  name,
  type = 'text',
  required,
  dir,
  defaultValue,
}: {
  label: string
  name: string
  type?: string
  required?: boolean
  dir?: 'ltr' | 'rtl'
  defaultValue?: string
}) {
  return (
    <label className="flex flex-col gap-2 text-sm text-muted">
      <span className="font-medium text-foreground">{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        dir={dir}
        defaultValue={defaultValue}
        className={fieldClassName}
      />
    </label>
  )
}
