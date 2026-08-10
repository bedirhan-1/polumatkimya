function trimTrailingSlash(value: string) {
  return value.replace(/\/$/, '')
}

export function getR2PublicBaseUrl() {
  const value = process.env.NEXT_PUBLIC_R2_PUBLIC_URL?.trim()
  return value ? trimTrailingSlash(value) : null
}

export function getR2BucketName() {
  return process.env.R2_BUCKET_NAME?.trim() || 'polumatkimya'
}

export function getR2AccountId() {
  return process.env.R2_ACCOUNT_ID?.trim() || null
}

export function getR2AccessKeyId() {
  return process.env.R2_ACCESS_KEY_ID?.trim() || null
}

export function getR2SecretAccessKey() {
  return process.env.R2_SECRET_ACCESS_KEY?.trim() || null
}

/** S3 credentials available — required to upload on miss and stream from R2. */
export function isR2WriteConfigured() {
  return Boolean(getR2AccountId() && getR2AccessKeyId() && getR2SecretAccessKey())
}

/** Public site should use the R2 media pipeline (NEXT_PUBLIC flag). */
export function isR2PublicConfigured() {
  return Boolean(getR2PublicBaseUrl())
}
