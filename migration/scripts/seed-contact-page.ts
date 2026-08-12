/**
 * Creates the field-level localized Contact page singleton.
 * Existing content is left untouched so editorial changes are never overwritten.
 *
 * Usage:
 *   npm run seed:contact-page
 *   npm run seed:contact-page -- --dataset=production
 *   npm run seed:contact-page -- --dataset=all
 *   npm run seed:contact-page -- --force
 */
import {createClient} from '@sanity/client'
import {randomBytes} from 'node:crypto'
import {existsSync, readFileSync} from 'node:fs'
import path from 'node:path'

import {localizedString, localizedText} from './lib'

function loadEnvFile(filePath: string) {
  if (!existsSync(filePath)) return

  for (const rawLine of readFileSync(filePath, 'utf8').split('\n')) {
    const line = rawLine.trim()
    if (!line || line.startsWith('#')) continue
    const separator = line.indexOf('=')
    if (separator <= 0) continue

    const keyName = line.slice(0, separator).trim()
    let value = line.slice(separator + 1).trim()
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }
    if (!(keyName in process.env)) process.env[keyName] = value
  }
}

loadEnvFile(path.resolve(process.cwd(), '.env.local'))
loadEnvFile(path.resolve(process.cwd(), '.env'))

function key() {
  return randomBytes(6).toString('hex')
}

function phone(label: {tr: string; en: string; ar: string}, value: string) {
  return {
    _key: key(),
    _type: 'contactPhone',
    label: localizedString(label),
    phone: value,
  }
}

function email(label: {tr: string; en: string; ar: string}, value: string) {
  return {
    _key: key(),
    _type: 'contactEmail',
    label: localizedString(label),
    email: value,
  }
}

function location(input: {
  locationId: string
  label: {tr: string; en: string; ar: string}
  addressLine: {tr: string; en: string; ar: string}
  city: {tr: string; en: string; ar: string}
  postalCode: string
  mapEmbedUrl: string
  mapsUrl: string
  mapTitle: {tr: string; en: string; ar: string}
}) {
  return {
    _key: key(),
    _type: 'contactLocation',
    locationId: input.locationId,
    label: localizedString(input.label),
    addressLine: localizedString(input.addressLine),
    city: localizedString(input.city),
    postalCode: input.postalCode,
    mapEmbedUrl: input.mapEmbedUrl,
    mapsUrl: input.mapsUrl,
    mapTitle: localizedString(input.mapTitle),
  }
}

function buildDocument() {
  return {
    _id: 'contactPage',
    _type: 'contactPage',
    eyebrow: localizedString({
      tr: 'Polumat Kimya',
      en: 'Polumat Kimya',
      ar: 'بولومات كيميا',
    }),
    title: localizedString({
      tr: 'İletişim',
      en: 'Contact',
      ar: 'اتصل بنا',
    }),
    intro: localizedText({
      tr: 'Çaycuma / Zonguldak fabrikamızdan üretim, ihracat ve bayi ekiplerine ulaşın.',
      en: 'Reach our manufacturing, export and dealer teams from our Çaycuma / Zonguldak factory.',
      ar: 'تواصل مع فرق الإنتاج والتصدير والوكلاء من مصنعنا في تشايكوما / زونغولداق.',
    }),
    phonesSectionTitle: localizedString({
      tr: 'Telefon',
      en: 'Phone',
      ar: 'الهاتف',
    }),
    emailsSectionTitle: localizedString({
      tr: 'E-posta',
      en: 'Email',
      ar: 'البريد الإلكتروني',
    }),
    corporateSectionTitle: localizedString({
      tr: 'Kurumsal',
      en: 'Company',
      ar: 'الشركة',
    }),
    corporatePhone: '+90 372 615 77 70',
    corporateEmail: 'fabrika@polumatkimya.com',
    phones: [
      phone({tr: 'Fabrika', en: 'Factory', ar: 'المصنع'}, '+90 372 615 77 70'),
      phone({tr: 'Mobil', en: 'Mobile', ar: 'الجوال'}, '+90 533 897 28 24'),
      phone({tr: 'Mobil', en: 'Mobile', ar: 'الجوال'}, '+90 543 877 81 35'),
    ],
    emails: [
      email({tr: 'Fabrika', en: 'Factory', ar: 'المصنع'}, 'fabrika@polumatkimya.com'),
      email({tr: 'Export', en: 'Export', ar: 'التصدير'}, 'export@polumat.com'),
    ],
    locations: [
      location({
        locationId: 'factory',
        label: {tr: 'Fabrika', en: 'Factory', ar: 'المصنع'},
        addressLine: {
          tr: 'Velioğlu OSB Mahallesi, 11 Nolu Sokak No: 3',
          en: 'Velioğlu OSB Mahallesi, 11 Nolu Sokak No: 3',
          ar: 'حي فيليو أو إس بي، شارع رقم 11 رقم: 3',
        },
        city: {
          tr: 'Çaycuma / Zonguldak',
          en: 'Çaycuma / Zonguldak',
          ar: 'تشايكوما / زونغولداق',
        },
        postalCode: '67900',
        mapEmbedUrl:
          'https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d24969.54637002056!2d32.134079!3d41.404388!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x409c9df2982d432d%3A0x199446ced2931174!2sPolumat%20Kimya%20San.Tic.Ltd.%C5%9Eti!5e1!3m2!1str!2sus!4v1786290800135!5m2!1str!2sus',
        mapsUrl:
          'https://www.google.com/maps/search/?api=1&query=Polumat%20Kimya%20San.Tic.Ltd.%C5%9Eti%20%C3%87aycuma',
        mapTitle: {
          tr: 'Fabrika konumu haritası',
          en: 'Factory location map',
          ar: 'خريطة موقع المصنع',
        },
      }),
      location({
        locationId: 'istanbul',
        label: {tr: 'İstanbul', en: 'Istanbul', ar: 'إسطنبول'},
        addressLine: {
          tr: 'İkitelli OSB, Pik Dökümcüler A4 Blok Sk No: 3',
          en: 'İkitelli OSB, Pik Dökümcüler A4 Blok Sk No: 3',
          ar: 'إيكيتيلي أو إس بي، بيك دوكومجولر A4 بلوك شارع رقم: 3',
        },
        city: {
          tr: 'Başakşehir / İstanbul',
          en: 'Başakşehir / Istanbul',
          ar: 'باشاكشهر / إسطنبول',
        },
        postalCode: '34490',
        mapEmbedUrl:
          'https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d12026.965978698898!2d28.799019679427147!3d41.096494452493765!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14caaf6f18d96aa9%3A0x3f34d103a6f7ecb5!2zxLBraXRlbGxpIE9TQiwgUGlrIETDtmvDvG1jw7xsZXIgQTQgQmxvayBTayBObzozLCAzNDQ5MCBCYcWfYWvFn2VoaXIvxLBzdGFuYnVs!5e0!3m2!1str!2str!4v1786531849261!5m2!1str!2str',
        mapsUrl:
          'https://www.google.com/maps/search/?api=1&query=%C4%B0kitelli%20OSB%20Pik%20D%C3%B6k%C3%BCmc%C3%BCler%20A4%20Blok%20Sk%20No:3%20Ba%C5%9Fak%C5%9Fehir%20%C4%B0stanbul',
        mapTitle: {
          tr: 'İstanbul ofisi haritası',
          en: 'Istanbul office map',
          ar: 'خريطة مكتب إسطنبول',
        },
      }),
    ],
    formTitle: localizedString({
      tr: 'Bize yazın',
      en: 'Write to us',
      ar: 'راسلنا',
    }),
    formDescription: localizedText({
      tr: 'Sipariş veya teknik bilgi talepleriniz için formu doldurun. Export hattımız uluslararası iş ortaklarına açıktır.',
      en: 'Use the form for orders or technical questions. Our export desk supports international partners.',
      ar: 'استخدم النموذج للطلبات والأسئلة الفنية. مكتب التصدير يدعم الشركاء الدوليين.',
    }),
    openInMapsLabel: localizedString({
      tr: 'Google Maps’te aç',
      en: 'Open in Google Maps',
      ar: 'افتح في خرائط Google',
    }),
    formSuccessMessage: localizedText({
      tr: 'Mesajınız alındı. En kısa sürede dönüş yapacağız.',
      en: 'Your message was received. We will get back to you shortly.',
      ar: 'تم استلام رسالتك. سنعود إليك في أقرب وقت.',
    }),
    formErrorMessage: localizedText({
      tr: 'Mesaj gönderilemedi. Lütfen tekrar deneyin.',
      en: 'Could not send your message. Please try again.',
      ar: 'تعذر إرسال رسالتك. يرجى المحاولة مرة أخرى.',
    }),
    seo: {
      _type: 'localizedSeo',
      title: localizedString({
        tr: 'İletişim | Polumat Kimya',
        en: 'Contact | Polumat Kimya',
        ar: 'اتصل بنا | بولومات كيميا',
      }),
      description: localizedText({
        tr: 'Polumat Kimya iletişim bilgileri, fabrika ve İstanbul ofis adresleri, telefon ve e-posta.',
        en: 'Polumat Kimya contact details, factory and Istanbul office addresses, phone and email.',
        ar: 'بيانات التواصل مع بولومات كيميا وعناوين المصنع ومكتب إسطنبول والهاتف والبريد الإلكتروني.',
      }),
      noIndex: false,
    },
  }
}

const LEGACY_IDS = [
  'contactPage-tr',
  'contactPage-en',
  'contactPage-ar',
  'drafts.contactPage-tr',
  'drafts.contactPage-en',
  'drafts.contactPage-ar',
  'drafts.contactPage',
]

async function seedDataset(dataset: string, force: boolean) {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
  const token = process.env.SANITY_API_WRITE_TOKEN
  if (!projectId || !token) throw new Error('Missing Sanity project id or write token')

  const client = createClient({
    projectId,
    dataset,
    apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2026-08-02',
    token,
    useCdn: false,
  })

  const existing = await client.getDocument('contactPage')
  if (existing && !force) {
    console.log(`Contact page already exists on ${dataset}; keeping editorial content.`)
  } else {
    await client.createOrReplace(buildDocument())
    console.log(`Contact page ${existing ? 'replaced' : 'created'} on ${dataset}.`)
  }

  for (const id of LEGACY_IDS) {
    try {
      await client.delete(id)
      console.log(`Removed legacy document ${id} on ${dataset}.`)
    } catch {
      // ignore missing docs
    }
  }
}

async function main() {
  const datasetArg = process.argv.find((argument) => argument.startsWith('--dataset='))
  const force = process.argv.includes('--force')
  const requested =
    datasetArg?.slice('--dataset='.length) ||
    process.env.NEXT_PUBLIC_SANITY_DATASET ||
    'development'
  const datasets = requested === 'all' ? ['development', 'production'] : [requested]

  for (const dataset of datasets) await seedDataset(dataset, force)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
