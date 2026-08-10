import {S3Client} from '@aws-sdk/client-s3'

import {
  getR2AccessKeyId,
  getR2AccountId,
  getR2SecretAccessKey,
  isR2WriteConfigured,
} from './env'

let client: S3Client | null = null

export function getR2Client() {
  if (!isR2WriteConfigured()) {
    throw new Error('R2 write credentials are not configured')
  }

  if (client) return client

  const accountId = getR2AccountId()!
  client = new S3Client({
    region: 'auto',
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: getR2AccessKeyId()!,
      secretAccessKey: getR2SecretAccessKey()!,
    },
    // AWS SDK v3 default checksums break some R2 operations.
    requestChecksumCalculation: 'WHEN_REQUIRED',
    responseChecksumValidation: 'WHEN_REQUIRED',
  })

  return client
}
