/**
 * Fills corporate (Kurumsal) pages with content from the live Polumat site.
 *
 * Usage:
 *   npx tsx migration/scripts/seed-corporate-pages.ts
 *   npx tsx migration/scripts/seed-corporate-pages.ts --dataset=all
 */
import {createClient, type SanityClient} from '@sanity/client'
import {createHash, randomBytes} from 'node:crypto'
import {existsSync, readFileSync} from 'node:fs'
import path from 'node:path'

import {textToPortableText} from './lib'

function loadEnvFile(filePath: string) {
  if (!existsSync(filePath)) return
  for (const rawLine of readFileSync(filePath, 'utf8').split('\n')) {
    const line = rawLine.trim()
    if (!line || line.startsWith('#')) continue
    const eq = line.indexOf('=')
    if (eq <= 0) continue
    const key = line.slice(0, eq).trim()
    let value = line.slice(eq + 1).trim()
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }
    if (!(key in process.env)) process.env[key] = value
  }
}

loadEnvFile(path.resolve(process.cwd(), '.env.local'))
loadEnvFile(path.resolve(process.cwd(), '.env'))

function key() {
  return randomBytes(4).toString('hex')
}

type Locale = 'tr' | 'en' | 'ar'

type PageSeed = {
  slug: string
  legacyUrl: string
  /** Unique hero/content image from the live corporate page. */
  imageUrl: string
  titles: Record<Locale, string>
  seoDescriptions: Record<Locale, string>
  bodies: Record<Locale, string>
  eyebrow?: Record<Locale, string>
}

const PAGES: PageSeed[] = [
  {
    slug: 'about',
    legacyUrl: '/sayfa/hakkimizda',
    imageUrl: 'https://polumatkimya.com/images/pages/1740155208.webp',
    titles: {tr: 'Hakkımızda', en: 'About us', ar: 'من نحن'},
    seoDescriptions: {
      tr: 'Tek yerleşkede double hat ile günlük 30.000+ üretim kapasitesi.',
      en: 'Daily production capacity of 30,000+ units with dual lines on a single campus.',
      ar: 'طاقة إنتاج يومية تتجاوز 30,000 وحدة بخطوط مزدوجة في حرم واحد.',
    },
    bodies: {
      tr: `TEK YERLEŞKEDE DOUBLE HAT İLE GÜNLÜK 30.000+ ÜRETİM KAPASİTESİ

Polumat Kimya olarak, geniş ürün yelpazemizle sanayi ve bireysel kullanımlar için yüksek kaliteli kimyasal ürünler üretiyoruz. Ürün portföyümüzde, fren balata temizleyicilerden çok amaçlı sprey ve pas sökücülere kadar çeşitli ihtiyaçlara yönelik ürünler bulunmaktadır. MDF kit aktivatörlerimiz ve motor temizleme spreylerimiz ile endüstriyel bakımda ihtiyaç duyduğunuz çözümleri sağlıyoruz.

Ayrıca, sıvı gres zincir yağlayıcılarımız ve universal silikonlarımız, mekanik ve yapı projelerinizde güvenle kullanabileceğiniz ürünlerdir. Akvaryum silikonu, güçlü silikon, duşakabin silikonu, ayna silikonu gibi özel amaçlı silikon çeşitlerimiz, her türlü montaj ve sızdırmazlık ihtiyacınızı karşılamak üzere tasarlanmıştır.

ÇEVRESEL SORUMLULUK
Polumat Kimya, çevreye duyarlı üretim süreçleri geliştirmeye büyük önem vermektedir. Sürdürülebilirlik ilkelerimiz doğrultusunda, atık yönetimi ve enerji tasarrufu konularında çeşitli projeler yürütmekteyiz. Gelecek nesillere daha yaşanabilir bir dünya bırakmak için çalışıyoruz.

İhtiyacınız olan tüm kimyasal ürün tedariğinde Polumat Kimya yanınızda!`,
      en: `DAILY PRODUCTION CAPACITY OF 30,000+ UNITS WITH DUAL LINES ON A SINGLE CAMPUS

At Polumat Kimya we manufacture high-quality chemical products for industrial and individual use. Our portfolio spans brake cleaners, multipurpose sprays and rust removers, as well as MDF kit activators and engine cleaners for industrial maintenance.

Our liquid grease chain lubricants and universal silicones support mechanical and construction projects. Specialty silicones for aquariums, shower enclosures, mirrors and general sealing are engineered for reliable bonding and waterproofing.

ENVIRONMENTAL RESPONSIBILITY
We invest in environmentally conscious production. Guided by sustainability principles, we run projects in waste management and energy efficiency — working toward a more livable world for future generations.

For the chemical products you need, Polumat Kimya stands with you.`,
      ar: `طاقة إنتاج يومية تتجاوز 30,000 وحدة بخطوط مزدوجة في حرم واحد

تنتج بولومات كيميا منتجات كيميائية عالية الجودة للاستخدام الصناعي والفردي. يشمل نطاقنا منظفات الفرامل والبخاخات متعددة الأغراض ومزيلات الصدأ، إضافة إلى منشطات أطقم MDF ومنظفات المحركات لصيانة المنشآت.

تدعم مزلقات السلاسل بالشحم السائل والسيليكون العام مشاريع الميكانيكا والبناء. وتُصمَّم أنواع السيليكون الخاصة لأحواض الأسماك وكبائن الدش والمرايا وللاستخدامات العامة لضمان الإغلاق والالتصاق الموثوق.

المسؤولية البيئية
نستثمر في عمليات إنتاج تراعي البيئة، وندير مشاريع لإدارة النفايات وترشيد الطاقة من أجل مستقبل أكثر استدامة.

بولومات كيميا إلى جانبكم لتلبية احتياجاتكم من المنتجات الكيميائية.`,
    },
  },
  {
    slug: 'mission-and-vision',
    legacyUrl: '/sayfa/misyon-ve-vizyonumuz',
    imageUrl: 'https://polumatkimya.com/images/pages/1740241838.webp',
    titles: {
      tr: 'Misyon ve Vizyonumuz',
      en: 'Mission and vision',
      ar: 'رسالتنا ورؤيتنا',
    },
    seoDescriptions: {
      tr: 'Endüstriyel sprey ve yapı kimyasallarında yenilikçi çözümlerle müşterilerimize değer katıyoruz.',
      en: 'Delivering innovative solutions in industrial sprays and construction chemicals.',
      ar: 'نقدم حلولاً مبتكرة في البخاخات الصناعية وكيماويات البناء.',
    },
    bodies: {
      tr: `Endüstriyel sprey ve yapı kimyasalları sektöründe yenilikçi çözümler sunarak müşterilerimizin ihtiyaçlarını karşılamayı ve onlara değer katmayı amaçlıyoruz.

Misyonumuz, güvenilir ve çevre dostu ürünler geliştirerek, sürdürülebilir bir gelecek için katkıda bulunmaktır. Bu doğrultuda;

Müşteri Memnuniyeti: Yüksek kaliteli ürünler ve hizmetler sunarak, müşterilerimizin beklentilerini aşmayı hedefliyoruz.
İnovasyon: Sürekli araştırma ve geliştirme faaliyetleri ile sektördeki yenilikleri takip ediyor, ürün ve hizmetlerimizi sürekli olarak iyileştiriyoruz.
Çevre Dostu Yaklaşım: Çevresel sorumluluklarımızın bilincinde olarak, doğaya saygılı ve sürdürülebilir ürünler üretmeyi taahhüt ediyoruz.

Vizyonumuz, global ölçekte tanınan ve saygı duyulan bir kimya firması olarak sektörde lider konuma gelmektir. Bu vizyon doğrultusunda;

Liderlik: Yenilikçi ürün ve hizmetlerle sektörde öncü bir rol üstlenmek.
Global Büyüme: Uluslararası pazarlarda güçlü bir varlık göstererek, global bir marka olmak.
Topluma Katkı: Sosyal sorumluluk projeleri ile topluma değer katmak ve daha yaşanabilir bir dünya için çalışmak.

Polumat Kimya, misyon ve vizyonunu hayata geçirirken, etik değerlerden ödün vermeden, şeffaf ve sorumlu bir iş anlayışıyla hareket etmektedir.`,
      en: `We aim to meet customer needs and add value through innovative solutions in industrial sprays and construction chemicals.

Our mission is to develop reliable, environmentally friendly products that contribute to a sustainable future. In this spirit we focus on:

Customer satisfaction: Exceeding expectations with high-quality products and services.
Innovation: Continuous R&D so we can improve our offering.
Environmental care: Manufacturing respectfully and sustainably.

Our vision is to become a globally recognized and respected chemistry company — a sector leader known for innovation, international growth and social contribution.

Polumat Kimya pursues this mission and vision with ethical, transparent and responsible business practices.`,
      ar: `نهدف إلى تلبية احتياجات عملائنا وإضافة قيمة عبر حلول مبتكرة في البخاخات الصناعية وكيماويات البناء.

رسالتنا تطوير منتجات موثوقة وصديقة للبيئة تساهم في مستقبل مستدام، مع التركيز على رضا العملاء والابتكار والمسؤولية البيئية.

رؤيتنا أن نصبح شركة كيمياء معروفة ومحترمة عالمياً، رائدة في القطاع من خلال الابتكار والنمو الدولي والمساهمة المجتمعية.

تعمل بولومات كيميا بشفافية ومسؤولية وأخلاق دون المساومة على قيمها.`,
    },
  },
  {
    slug: 'quality-certificates',
    legacyUrl: '/sayfa/polumat-kalitesi',
    imageUrl: 'https://polumatkimya.com/images/pages/1740244012.webp',
    titles: {tr: 'Polumat Kalitesi', en: 'Polumat quality', ar: 'جودة بولومات'},
    seoDescriptions: {
      tr: 'ISO 9001 odaklı kalite politikamız ve sürekli iyileştirme yaklaşımımız.',
      en: 'Our ISO 9001-oriented quality policy and continuous improvement approach.',
      ar: 'سياسة الجودة وفق ISO 9001 ونهج التحسين المستمر.',
    },
    bodies: {
      tr: `Kaliteyi işimizin temel taşı olarak görmekteyiz. Kalite politikamız, müşteri memnuniyetini en üst düzeyde tutmayı ve sürekli iyileştirme süreçleri ile sektörde öncü bir kuruluş olmayı hedeflemektedir.

Müşteri Odaklılık
Müşteri ihtiyaçlarını dikkatle dinler, taleplerine uygun çözümler sunarız. Geri bildirimleri değerlendirir, memnuniyeti artıracak önlemler alırız.

Sürekli İyileştirme
ISO 9001 standartlarına uygun bir kalite yönetim sistemi uygularız. Süreçlerimizi düzenli olarak gözden geçirir ve geliştirme fırsatlarını değerlendiririz.

Çalışan Katılımı
Çalışanlarımızın bilgi ve beceri düzeylerini artırmak için sürekli eğitimler düzenleriz ve kalite süreçlerine aktif katılımlarını teşvik ederiz.

Çevre ve Güvenlik
Çevreye duyarlı üretim süreçleri geliştirir; güvenli ve sağlıklı bir çalışma ortamı için gerekli önlemleri alırız.

Etik İş Uygulamaları
Dürüstlük, şeffaflık ve yasal uyuma bağlı kalırız. Bu çerçevede ürün ve hizmet kalitesini sürekli artırmayı taahhüt ediyoruz.`,
      en: `Quality is the cornerstone of our work. Our policy aims for top-tier customer satisfaction and continuous improvement that keeps us ahead in the sector.

Customer focus
We listen carefully, deliver fitting solutions and act on feedback.

Continuous improvement
We operate a quality management system aligned with ISO 9001 and regularly review our processes.

Employee involvement
Ongoing training and active participation in quality processes.

Environment & safety
Environmentally conscious production and a safe, healthy workplace.

Ethical practice
Honesty, transparency and legal compliance — we commit to continually raising product and service quality.`,
      ar: `الجودة حجر أساس عملنا. تهدف سياستنا إلى أعلى مستويات رضا العملاء والتحسين المستمر.

التركيز على العميل، التحسين المستمر وفق ISO 9001، مشاركة الموظفين، المسؤولية البيئية والسلامة، والممارسات الأخلاقية الشفافة — نلتزم برفع جودة منتجاتنا وخدماتنا باستمرار.`,
    },
  },
  {
    slug: 'environmental-responsibility',
    legacyUrl: '/sayfa/cevreye-duyarlilik',
    imageUrl: 'https://polumatkimya.com/images/pages/1740244419.webp',
    titles: {
      tr: 'Çevreye Duyarlılık',
      en: 'Environmental responsibility',
      ar: 'المسؤولية البيئية',
    },
    seoDescriptions: {
      tr: 'Sürdürülebilirlik, atık yönetimi ve ISO 14001 odaklı çevre politikamız.',
      en: 'Sustainability, waste management and our ISO 14001-oriented environmental policy.',
      ar: 'الاستدامة وإدارة النفايات وسياستنا البيئية وفق ISO 14001.',
    },
    bodies: {
      tr: `Çevreye olan sorumluluğumuzu ciddiyetle ele alarak sürdürülebilirlik ilkeleri doğrultusunda hareket ediyoruz.

Kaynakların Etkin Kullanımı
Enerji ve doğal kaynakların verimli kullanımı teşvik edilir; israfın önlenmesi için gerekli önlemler alınır.

Atık Yönetimi
Atık oluşumunu minimize etmek ve geri dönüşüm oranlarını artırmak amacıyla etkili atık yönetim sistemleri uygulanır.

Kirliliğin Önlenmesi
Üretim süreçlerinde çevresel etkileri en aza indirmek için kirlilik önleyici teknolojiler ve süreç iyileştirmeleri sürekli gözden geçirilir.

Sürdürülebilirlik Uygulamaları
Yenilenebilir enerji kullanımını artırarak karbon ayak izimizi küçültmeyi hedefliyoruz. Çalışanlarımıza ve paydaşlarımıza çevre bilinci kazandırmak için düzenli eğitimler yürütüyoruz.

Yasal Uygunluk
İlgili çevre mevzuatına uyum sağlar; ISO 14001 Çevre Yönetim Sistemi başta olmak üzere uluslararası standartlara uygun süreçler geliştiririz.

Polumat Kimya olarak çevre politikamızı sürekli gözden geçirerek daha sürdürülebilir bir gelecek için çalışmaya devam edeceğiz.`,
      en: `We take environmental responsibility seriously and act on sustainability principles.

Efficient resource use, waste minimization and recycling, pollution prevention, renewable energy where possible, employee awareness, and compliance with environmental law and ISO 14001 — these define our environmental policy.

Polumat Kimya will keep reviewing and improving this policy for a more sustainable future.`,
      ar: `نأخذ مسؤوليتنا البيئية بجدية ونعمل وفق مبادئ الاستدامة: كفاءة الموارد، إدارة النفايات، منع التلوث، الطاقة المتجددة، التوعية، والامتثال للأنظمة وISO 14001.

سنواصل مراجعة سياستنا البيئية من أجل مستقبل أكثر استدامة.`,
    },
  },
  {
    slug: 'occupational-health-and-safety',
    legacyUrl: '/sayfa/is-sagligi-ve-guvenligi',
    imageUrl: 'https://polumatkimya.com/images/pages/1740247535.webp',
    titles: {
      tr: 'İş Sağlığı ve Güvenliği',
      en: 'Occupational health and safety',
      ar: 'الصحة والسلامة المهنية',
    },
    seoDescriptions: {
      tr: 'İSG önceliğimiz: yasal uyum, risk yönetimi ve sürekli iyileştirme.',
      en: 'OHS first: legal compliance, risk management and continuous improvement.',
      ar: 'السلامة أولاً: الامتثال القانوني وإدارة المخاطر والتحسين المستمر.',
    },
    bodies: {
      tr: `İş sağlığı ve güvenliği (İSG) önceliklerimizin başında gelmektedir. Çalışanlarımızın, müşterilerimizin ve çevremizin güvenliğini sağlamak için kararlı bir şekilde çalışıyoruz.

Temel İlkelerimiz
Öncelikli Güvenlik: Tüm faaliyetlerimizde güvenliği birinci öncelik olarak belirler; iş kazalarını ve meslek hastalıklarını önlemek için proaktif yaklaşımlar geliştiririz.
Yasal Uyum: Ulusal ve uluslararası İSG gerekliliklerine uyarız.
Sürekli İyileştirme: İSG performansımızı düzenli gözden geçirir, teknolojik yeniliklerle riskleri minimize ederiz.
Eğitim ve Farkındalık: Düzenli eğitimlerle güvenli çalışma kültürünü teşvik ederiz.
Risk Yönetimi: İş süreçlerinde risk değerlendirmesi yapar, önleyici tedbirler alırız.
Katılımcı Yaklaşım: Çalışanların ve ilgili tarafların İSG süreçlerine katılımını teşvik ederiz.

Sorumluluklarımız
Üst yönetim politikamızın uygulanmasından; her çalışan kendi ve çevresinin güvenliğinden; İSG ekibi ise rehberlik ve destekten sorumludur.

Polumat Kimya olarak İSG alanında örnek bir şirket olmayı hedefliyoruz. Çalışanlarımızın ve iş ortaklarımızın güvenliği bizim için en büyük önceliktir.`,
      en: `Occupational health and safety (OHS) is among our top priorities. We work decisively to protect employees, customers and our surroundings.

Core principles: safety first, legal compliance, continuous improvement, training and awareness, risk management, and participatory engagement.

Management owns policy delivery; every employee owns personal and peer safety; our OHS team provides guidance.

Polumat Kimya aims to be an exemplary company in OHS — the safety of our people and partners comes first.`,
      ar: `الصحة والسلامة المهنية من أولوياتنا القصوى. نعمل لحماية موظفينا وعملائنا ومحيطنا عبر الامتثال القانوني وإدارة المخاطر والتدريب والتحسين المستمر.

الإدارة مسؤولة عن تنفيذ السياسة، وكل موظف عن سلامته وسلامة من حوله، وفريق السلامة عن الإرشاد والدعم.

سلامة موظفينا وشركائنا هي أولويتنا الكبرى.`,
    },
  },
  {
    slug: 'customer-satisfaction',
    legacyUrl: '/sayfa/musteri-memnuniyeti',
    imageUrl: 'https://polumatkimya.com/images/pages/1740247910.webp',
    titles: {
      tr: 'Müşteri Memnuniyeti',
      en: 'Customer satisfaction',
      ar: 'رضا العملاء',
    },
    seoDescriptions: {
      tr: 'Müşteri odaklı hizmet, kalite güvencesi ve uzun vadeli ilişkiler.',
      en: 'Customer-focused service, quality assurance and long-term relationships.',
      ar: 'خدمة تركز على العميل وضمان الجودة وعلاقات طويلة الأمد.',
    },
    bodies: {
      tr: `Müşteri memnuniyetini en üst düzeyde tutmayı hedefleyen bir politika izlemekteyiz.

Müşteri Odaklı Yaklaşım
İhtiyaç analizi yapar, kişiselleştirilmiş çözümler sunarak beklentileri aşmayı hedefleriz.

Kalite Güvencesi
Yüksek kalite standartlarına uygun ürünler için titiz kontrol süreçleri uygular; ürün ve hizmetleri sürekli iyileştiririz.

Etkin İletişim
Geri bildirimleri dikkate alır, ürün ve hizmetler hakkında düzenli ve doğru bilgilendirme yaparız.

Müşteri Sadakati
Uzun vadeli ilişkiler kurar, sadakati destekleyen teşvik programları sunarız.

Çevre ve Toplum Sorumluluğu
Çevreye duyarlı üretim ve sosyal sorumluluk projeleri ile topluma katkıda bulunuruz.

Polumat Kimya olarak siz değerli müşterilerimize en iyi hizmeti sunmayı taahhüt ediyoruz.`,
      en: `We pursue a policy that keeps customer satisfaction at the highest level.

Customer focus, quality assurance, clear communication, long-term loyalty and social responsibility guide how we work.

Polumat Kimya commits to delivering the best possible service to our customers.`,
      ar: `نتبع سياسة تضع رضا العملاء في أعلى مستوى عبر التركيز على الاحتياجات وضمان الجودة والتواصل الواضح والعلاقات طويلة الأمد والمسؤولية المجتمعية.

نلتزم بتقديم أفضل خدمة لعملائنا الكرام.`,
    },
  },
  {
    slug: 'human-resources',
    legacyUrl: '/sayfa/insan-kaynaklari',
    imageUrl: 'https://polumatkimya.com/images/pages/1740248307.webp',
    titles: {tr: 'İnsan Kaynakları', en: 'Human resources', ar: 'الموارد البشرية'},
    seoDescriptions: {
      tr: 'Adil işe alım, eğitim-gelişim ve çalışan refahı odaklı İK politikamız.',
      en: 'Fair hiring, learning & development and employee wellbeing.',
      ar: 'توظيف عادل وتطوير مهني ورفاه للموظفين.',
    },
    bodies: {
      tr: `Çalışanlarımızın mutluluğu ve gelişimi, şirketimizin başarısının temel taşlarından biridir.

İşe Alım Süreci
Tüm adaylara eşit fırsat sunulur; değerlendirme yetenek ve deneyim odaklı, objektif ölçütlerle yapılır. Çeşitlilik ve dahil etme teşvik edilir.

Eğitim ve Gelişim
Kariyer gelişim programları, liderlik eğitimleri, teknik beceri kursları ve mentorluk sunarız. Düzenli performans değerlendirmeleri ile geri bildirim veririz.

Çalışan Refahı
Sağlık ve güvenlik en üst düzeyde ele alınır. İş-yaşam dengesini destekleyen esnek uygulamalar tasarlanmıştır.

İletişim ve Katılım
Açık iletişimi teşvik eder; çalışanların görüşlerini ifade edebileceği kanallar ve katılımcı yönetim anlayışı sunarız.

Polumat Kimya İnsan Kaynakları politikası, yenilikçi ve sürdürülebilir bir iş ortamı yaratmayı hedefler.`,
      en: `Employee happiness and growth are foundations of our success.

Fair, objective hiring; diversity and inclusion; career development, leadership training and mentorship; wellbeing and work-life balance; open communication and participatory management — these define our HR policy.

Polumat Kimya aims to build an innovative, sustainable workplace where people can thrive.`,
      ar: `سعادة موظفينا وتطورهم من أسس نجاحنا.

توظيف عادل وموضوعي، تنوع وشمول، تطوير مهني وتدريب ومرشدية، رفاه وتوازن بين العمل والحياة، وتواصل مفتوح ومشاركة في الإدارة — هذه هي سياسة مواردنا البشرية.`,
    },
  },
]

async function uploadImage(client: SanityClient, url: string, filenameHint: string) {
  const response = await fetch(url)
  if (!response.ok) throw new Error(`Download failed ${url}: ${response.status}`)
  const buffer = Buffer.from(await response.arrayBuffer())
  const filename =
    url.split('/').pop()?.split('?')[0] ||
    `${filenameHint}-${createHash('sha1').update(url).digest('hex').slice(0, 8)}.webp`
  const asset = await client.assets.upload('image', buffer, {filename})
  return {
    _type: 'image' as const,
    asset: {_type: 'reference' as const, _ref: asset._id},
    alt: filenameHint,
  }
}

function localizedCtas(language: Locale) {
  if (language === 'en') {
    return {
      primary: {label: 'Request a quote', path: '/request-a-quote'},
      secondary: {label: 'Contact', path: '/contact'},
    }
  }
  if (language === 'ar') {
    return {
      primary: {label: 'اطلب عرض سعر', path: '/request-a-quote'},
      secondary: {label: 'اتصل بنا', path: '/contact'},
    }
  }
  return {
    primary: {label: 'Teklif Al', path: '/request-a-quote'},
    secondary: {label: 'İletişim', path: '/contact'},
  }
}

function buildPageBuilderForLocale(
  language: Locale,
  title: string,
  body: string,
  image: Awaited<ReturnType<typeof uploadImage>>,
) {
  const ctas = localizedCtas(language)
  const portable = textToPortableText(body)
  const lead = body.split('\n\n')[0]?.slice(0, 180)
  return [
    {
      _key: key(),
      _type: 'heroSection',
      eyebrow: 'Polumat Kimya',
      heading: title,
      description: lead,
      primaryCta: {
        _type: 'simpleCallToAction',
        label: ctas.primary.label,
        linkType: 'internal',
        internalPath: ctas.primary.path,
        variant: 'primary',
      },
      secondaryCta: {
        _type: 'simpleCallToAction',
        label: ctas.secondary.label,
        linkType: 'internal',
        internalPath: ctas.secondary.path,
        variant: 'secondary',
      },
      media: image,
    },
    {
      _key: 'intro',
      _type: 'imageTextSection',
      // Body-only block — hero already carries the page image.
      body: portable,
    },
  ]
}

async function ensureTranslationMetadata(
  client: SanityClient,
  refs: Array<{language: string; id: string}>,
) {
  if (refs.length < 2) return
  const ids = refs.map((ref) => ref.id)
  const existing = await client.fetch<{_id: string} | null>(
    `*[_type == "translation.metadata" && count((translations[].value._ref)[@ in $ids]) > 0][0]{_id}`,
    {ids},
  )
  const translations = refs.map((ref) => ({
    _key: ref.language,
    _type: 'internationalizedArrayReferenceValue',
    language: ref.language,
    value: {_type: 'reference', _ref: ref.id, _weak: true},
  }))
  if (existing?._id) {
    await client.patch(existing._id).set({translations, schemaTypes: ['page']}).commit()
  } else {
    await client.create({
      _type: 'translation.metadata',
      schemaTypes: ['page'],
      translations,
    })
  }
}

async function seedDataset(dataset: string) {
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

  console.log(`\nSeeding corporate pages → ${dataset}`)

  for (const page of PAGES) {
    const cover = await uploadImage(client, page.imageUrl, page.slug)
    const refs: Array<{language: string; id: string}> = []
    for (const language of ['tr', 'en', 'ar'] as const) {
      const existing = await client.fetch<{_id: string} | null>(
        `*[_type=="page" && language==$language && slug.current==$slug][0]{_id}`,
        {language, slug: page.slug},
      )

      const doc = {
        _type: 'page',
        language,
        translationStatus: 'complete',
        title: page.titles[language],
        slug: {_type: 'slug', current: page.slug},
        legacyUrls: language === 'tr' ? [page.legacyUrl] : [],
        seo: {
          _type: 'seo',
          title: `${page.titles[language]} | Polumat Kimya`,
          description: page.seoDescriptions[language],
          noIndex: false,
        },
        pageBuilder: buildPageBuilderForLocale(
          language,
          page.titles[language],
          page.bodies[language],
          cover,
        ),
      }

      let id: string
      if (existing?._id) {
        await client.patch(existing._id).set(doc).commit()
        id = existing._id
      } else {
        const created = await client.create(doc)
        id = created._id
      }
      refs.push({language, id})
      try {
        await client.delete(`drafts.${id}`)
      } catch {
        // ignore
      }
      console.log(`✓ ${language} ${page.slug}`)
    }
    await ensureTranslationMetadata(client, refs)
  }
}

async function main() {
  const arg = process.argv.find((item) => item.startsWith('--dataset='))
  const requested = arg?.split('=')[1] || process.env.NEXT_PUBLIC_SANITY_DATASET || 'development'
  const datasets = requested === 'all' ? ['development', 'production'] : [requested]
  for (const dataset of datasets) {
    await seedDataset(dataset)
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
