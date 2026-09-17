export function getResendApiKey() {
  return process.env.RESEND_API_KEY?.trim() || null
}

export function getContactToEmail() {
  return process.env.CONTACT_TO_EMAIL?.trim() || 'dev@polumatkimya.com'
}

export function getResendFrom() {
  return (
    process.env.RESEND_FROM?.trim() || 'Polumat Kimya <noreply@polumatkimya.com>'
  )
}

export function isEmailConfigured() {
  return Boolean(getResendApiKey())
}
