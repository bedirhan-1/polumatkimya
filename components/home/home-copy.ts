import type {Locale} from '@/lib/i18n/locales'

type FeatureCopy = {
  title: string
  description: string
}

type HomeCopy = {
  hero: {
    eyebrow: string
    lead: string
    accent: string
    tail: string
    description: string
    products: string
    quote: string
    imageAlt: string
  }
  trust: FeatureCopy[]
  products: {
    eyebrow: string
    title: string
    description: string
    all: string
    detail: string
  }
  strengths: {
    eyebrow: string
    title: string
    items: FeatureCopy[]
  }
  industries: {
    eyebrow: string
    title: string
    description: string
    detail: string
    viewAll: string
  }
  privateLabel: {
    eyebrow: string
    title: string
    description: string
    action: string
    visualLabel: string
    features: FeatureCopy[]
    processTitle: string
    process: FeatureCopy[]
  }
  about: {
    eyebrow: string
    title: string
    description: string
    action: string
    imageAlt: string
    videoPlayLabel: string
    stats: Array<{value: string; label: string}>
  }
  quality: {
    eyebrow: string
    title: string
    items: Array<{label: string}>
    badges: Array<{label: string}>
  }
  cta: {
    eyebrow: string
    title: string
    description: string
    quote: string
    contact: string
  }
}

const copy: Record<Locale, HomeCopy> = {
  tr: {
    hero: {
      eyebrow: 'Endüstriyel spreyler & yapı kimyasalları',
      lead: 'Güçlü kimya,',
      accent: 'daha yüksek',
      tail: 'performans',
      description:
        'Otomotiv, endüstri, bakım ve teknik servis uygulamaları için geliştirilmiş profesyonel kimyasal çözümler.',
      products: 'Ürünleri incele',
      quote: 'Teklif al',
      imageAlt: 'Polumat profesyonel aerosol ürün ailesi',
    },
    trust: [
      {title: 'Profesyonel kullanım', description: 'Sahada kanıtlanan formüller'},
      {title: 'Yüksek performans', description: 'Zorlu koşullarda güçlü sonuç'},
      {title: 'Premium kalite', description: 'Her aşamada kontrollü üretim'},
      {title: '50+ ülkeye ihracat', description: 'Dünyaya yayılan üretim gücü'},
    ],
    products: {
      eyebrow: 'Ürünlerimiz',
      title: 'Profesyonel çözümler, güçlü sonuçlar',
      description: 'Her uygulama için doğru formül, yüksek etki ve güvenilir performans.',
      all: 'Tüm ürünleri gör',
      detail: 'Ürünü incele',
    },
    strengths: {
      eyebrow: 'Neden Polumat?',
      title: 'Profesyonellerin tercih ettiği güçlü çözümler',
      items: [
        {title: 'Yüksek performans', description: 'Zorlu koşullarda güçlü etki sağlayan formüller.'},
        {title: 'Premium kalite', description: 'Hammadde seçiminden doluma kadar kalite kontrol.'},
        {title: 'Modern üretim', description: 'Yüksek kapasiteye sahip modern üretim hatları.'},
        {title: 'Global deneyim', description: '50’den fazla ülkeye ulaşan ihracat ağı.'},
        {title: 'Profesyonel kullanım', description: 'Bakım ve teknik servis ekipleri için geliştirildi.'},
        {title: 'Private label', description: 'Markanıza özel formül, ambalaj ve etiket üretimi.'},
      ],
    },
    industries: {
      eyebrow: 'Uygulama alanları',
      title: 'Her sektör için güvenilir bakım çözümleri',
      description: 'Sektöre özel ürün önerileri ve uygulama senaryolarını keşfedin.',
      detail: 'Çözümleri keşfet',
      viewAll: 'Tüm uygulama alanları',
    },
    privateLabel: {
      eyebrow: 'Private label',
      title: 'Kendi markanızla profesyonel kimyasal ürünler',
      description:
        'İhtiyacınıza uygun formül, ambalaj ve etiket seçenekleriyle markanızı güçlendiren, üretimi bize bırakan çözümler.',
      action: 'Private label teklifi al',
      visualLabel: 'Your brand',
      features: [
        {title: 'Özel formül', description: 'Markanıza özel ürün geliştirme'},
        {title: 'Özel ambalaj', description: 'Farklı hacim ve kutu seçenekleri'},
        {title: 'Özel etiket', description: 'Profesyonel etiket tasarımı'},
        {title: 'Dolum & paketleme', description: 'Yüksek kalite dolum ve paketleme'},
        {title: 'Lojistik destek', description: 'Zamanında teslimat ve lojistik çözüm'},
      ],
      processTitle: 'Private label süreci',
      process: [
        {title: 'İhtiyacınızı belirliyoruz', description: 'Ürün, ambalaj ve hedef pazar analizi.'},
        {title: 'Formül & numune', description: 'Size özel formül geliştirme ve numune hazırlığı.'},
        {title: 'Tasarım & ambalaj', description: 'Etiket, kutu ve ambalaj tasarımlarının hazırlığı.'},
        {title: 'Üretim & teslimat', description: 'Onaylanan ürünlerin üretimi ve sevkiyatı.'},
      ],
    },
    about: {
      eyebrow: 'Hakkımızda',
      title: 'Kimya ve aerosol çözümlerinde güvenilir iş ortağınız',
      description:
        'Polumat, profesyonel kullanıcıların ihtiyacı duyduğu yüksek performanslı aerosol ürünleri modern üretim altyapısı, kalite odaklı yaklaşımı ve uzun vadeli iş ortaklıklarıyla geliştirir.',
      action: 'Hakkımızda daha fazla bilgi',
      imageAlt: 'Polumat üretim tesisi ve lojistik alanı',
      videoPlayLabel: 'Tanıtım videosunu izle',
      stats: [
        {value: '50+', label: 'Ülkeye ihracat'},
        {value: '5', label: "Kıta'da iş ortaklığı"},
        {value: 'Modern', label: 'Üretim tesisi'},
        {value: 'Profesyonel', label: 'Ürün gamı'},
        {value: 'Private Label', label: 'Üretim desteği'},
      ],
    },
    quality: {
      eyebrow: 'Kalite ve güven',
      title: 'Her aşamada kontrol, her üründe güven',
      items: [
        {label: 'Seçilmiş hammadde'},
        {label: 'Kontrollü üretim'},
        {label: 'Performans testleri'},
        {label: 'Kalite kontrol süreçleri'},
        {label: 'Müşteri memnuniyeti odaklı hizmet'},
      ],
      badges: [
        {label: '9001:2015'},
        {label: '14001:2015'},
        {label: '45001:2018'},
        {label: 'Made in Türkiye'},
      ],
    },
    cta: {
      eyebrow: 'Doğru çözümü birlikte bulalım',
      title: 'İşletmeniz için doğru kimyasal çözümü bulun',
      description: 'Ürünlerimiz, özel marka üretimi ve teknik ihtiyaçlarınız için ekibimizle görüşün.',
      quote: 'Teklif al',
      contact: 'Bizimle iletişime geçin',
    },
  },
  en: {
    hero: {
      eyebrow: 'Industrial sprays & construction chemicals',
      lead: 'Powerful chemistry,',
      accent: 'higher',
      tail: 'performance',
      description: 'Professional chemical solutions for automotive, industry, maintenance and technical service applications.',
      products: 'Explore products',
      quote: 'Get a quote',
      imageAlt: 'Polumat professional aerosol product range',
    },
    trust: [
      {title: 'Professional use', description: 'Field-proven formulas'},
      {title: 'High performance', description: 'Powerful results in hard conditions'},
      {title: 'Premium quality', description: 'Controlled at every stage'},
      {title: 'Exported to 50+ countries', description: 'Manufacturing strength worldwide'},
    ],
    products: {
      eyebrow: 'Our products',
      title: 'Professional solutions, powerful results',
      description: 'The right formula, high impact and reliable performance for every application.',
      all: 'View all products',
      detail: 'View product',
    },
    strengths: {
      eyebrow: 'Why Polumat?',
      title: 'Powerful solutions chosen by professionals',
      items: [
        {title: 'High performance', description: 'Formulas engineered for demanding conditions.'},
        {title: 'Premium quality', description: 'Quality control from raw material to filling.'},
        {title: 'Modern production', description: 'High-capacity, modern production lines.'},
        {title: 'Global experience', description: 'An export network reaching 50+ countries.'},
        {title: 'Professional use', description: 'Developed for maintenance and service teams.'},
        {title: 'Private label', description: 'Custom formula, packaging and label production.'},
      ],
    },
    industries: {
      eyebrow: 'Application areas',
      title: 'Reliable maintenance solutions for every sector',
      description: 'Discover sector-specific product recommendations and application scenarios.',
      detail: 'Explore solutions',
      viewAll: 'All application areas',
    },
    privateLabel: {
      eyebrow: 'Private label',
      title: 'Professional chemical products under your own brand',
      description: 'Strengthen your brand with custom formulas, packaging and label options while we manage production.',
      action: 'Request a private label quote',
      visualLabel: 'Your brand',
      features: [
        {title: 'Custom formula', description: 'Product development for your brand'},
        {title: 'Custom packaging', description: 'Multiple volume and box options'},
        {title: 'Custom label', description: 'Professional label design'},
        {title: 'Filling & packing', description: 'High-quality filling and packing'},
        {title: 'Logistics support', description: 'On-time delivery solutions'},
      ],
      processTitle: 'Private label process',
      process: [
        {title: 'Define the need', description: 'Product, packaging and target market analysis.'},
        {title: 'Formula & sample', description: 'Custom formulation and sample preparation.'},
        {title: 'Design & packaging', description: 'Label, box and packaging preparation.'},
        {title: 'Production & delivery', description: 'Production and dispatch of approved products.'},
      ],
    },
    about: {
      eyebrow: 'About us',
      title: 'Your trusted partner in chemical and aerosol solutions',
      description:
        'Polumat develops high-performance aerosol products with modern production infrastructure, a quality-first approach and long-term partnerships.',
      action: 'Learn more about us',
      imageAlt: 'Polumat production facility and logistics area',
      videoPlayLabel: 'Watch the promo video',
      stats: [
        {value: '50+', label: 'Export countries'},
        {value: '5', label: 'Continents in partnership'},
        {value: 'Modern', label: 'Production facility'},
        {value: 'Professional', label: 'Product range'},
        {value: 'Private Label', label: 'Production support'},
      ],
    },
    quality: {
      eyebrow: 'Quality & trust',
      title: 'Controlled at every stage, trusted in every product',
      items: [
        {label: 'Selected raw materials'},
        {label: 'Controlled production'},
        {label: 'Performance tests'},
        {label: 'Quality control processes'},
        {label: 'Customer satisfaction focused service'},
      ],
      badges: [
        {label: '9001:2015'},
        {label: '14001:2015'},
        {label: '45001:2018'},
        {label: 'Made in Türkiye'},
      ],
    },
    cta: {
      eyebrow: 'Let’s find the right solution',
      title: 'Find the right chemical solution for your business',
      description: 'Talk to our team about our products, private label production and technical needs.',
      quote: 'Get a quote',
      contact: 'Contact us',
    },
  },
  ar: {
    hero: {
      eyebrow: 'بخاخات صناعية وكيماويات البناء',
      lead: 'كيمياء قوية،',
      accent: 'أداء',
      tail: 'أعلى',
      description: 'حلول كيميائية احترافية لتطبيقات السيارات والصناعة والصيانة والخدمة الفنية.',
      products: 'استكشف المنتجات',
      quote: 'اطلب عرضاً',
      imageAlt: 'مجموعة بخاخات بولومات الاحترافية',
    },
    trust: [
      {title: 'استخدام احترافي', description: 'تركيبات مثبتة ميدانياً'},
      {title: 'أداء عالٍ', description: 'نتائج قوية في الظروف الصعبة'},
      {title: 'جودة ممتازة', description: 'رقابة في كل مرحلة'},
      {title: 'تصدير إلى أكثر من 50 دولة', description: 'قوة إنتاج تصل إلى العالم'},
    ],
    products: {
      eyebrow: 'منتجاتنا',
      title: 'حلول احترافية، نتائج قوية',
      description: 'التركيبة المناسبة والتأثير القوي والأداء الموثوق لكل تطبيق.',
      all: 'عرض كل المنتجات',
      detail: 'عرض المنتج',
    },
    strengths: {
      eyebrow: 'لماذا بولومات؟',
      title: 'حلول قوية يختارها المحترفون',
      items: [
        {title: 'أداء عالٍ', description: 'تركيبات مصممة للظروف الصعبة.'},
        {title: 'جودة ممتازة', description: 'رقابة من المواد الخام حتى التعبئة.'},
        {title: 'إنتاج حديث', description: 'خطوط إنتاج حديثة وعالية السعة.'},
        {title: 'خبرة عالمية', description: 'شبكة تصدير تصل إلى أكثر من 50 دولة.'},
        {title: 'استخدام احترافي', description: 'مطورة لفرق الصيانة والخدمة.'},
        {title: 'علامة خاصة', description: 'تركيبة وعبوة وملصق مخصص.'},
      ],
    },
    industries: {
      eyebrow: 'مجالات التطبيق',
      title: 'حلول صيانة موثوقة لكل قطاع',
      description: 'اكتشف توصيات المنتجات وسيناريوهات التطبيق لكل قطاع.',
      detail: 'استكشف الحلول',
      viewAll: 'كل مجالات التطبيق',
    },
    privateLabel: {
      eyebrow: 'العلامة الخاصة',
      title: 'منتجات كيميائية احترافية بعلامتك التجارية',
      description: 'عزز علامتك بتركيبات وعبوات وملصقات مخصصة بينما نتولى نحن الإنتاج.',
      action: 'اطلب عرض علامة خاصة',
      visualLabel: 'علامتك',
      features: [
        {title: 'تركيبة خاصة', description: 'تطوير منتج لعلامتك'},
        {title: 'عبوة خاصة', description: 'خيارات أحجام وعلب متعددة'},
        {title: 'ملصق خاص', description: 'تصميم ملصق احترافي'},
        {title: 'تعبئة وتغليف', description: 'تعبئة وتغليف بجودة عالية'},
        {title: 'دعم لوجستي', description: 'حلول تسليم في الموعد'},
      ],
      processTitle: 'عملية العلامة الخاصة',
      process: [
        {title: 'تحديد الاحتياج', description: 'تحليل المنتج والعبوة والسوق.'},
        {title: 'التركيبة والعينة', description: 'تطوير التركيبة وتحضير العينة.'},
        {title: 'التصميم والعبوة', description: 'إعداد الملصق والعلبة والعبوة.'},
        {title: 'الإنتاج والتسليم', description: 'إنتاج وشحن المنتجات المعتمدة.'},
      ],
    },
    about: {
      eyebrow: 'من نحن',
      title: 'شريكك الموثوق في حلول الكيمياء والهباء الجوي',
      description:
        'تطور بولومات منتجات الهباء الجوي عالية الأداء ببنية إنتاج حديثة ونهج يركز على الجودة وشراكات طويلة الأمد.',
      action: 'اعرف المزيد عنا',
      imageAlt: 'منشأة إنتاج بولومات ومنطقة الخدمات اللوجستية',
      videoPlayLabel: 'شاهد فيديو التعريف',
      stats: [
        {value: '+50', label: 'دولة تصدير'},
        {value: '5', label: 'قارات للشراكة'},
        {value: 'حديث', label: 'مرفق الإنتاج'},
        {value: 'احترافي', label: 'مجموعة المنتجات'},
        {value: 'Private Label', label: 'دعم الإنتاج'},
      ],
    },
    quality: {
      eyebrow: 'الجودة والثقة',
      title: 'رقابة في كل مرحلة، ثقة في كل منتج',
      items: [
        {label: 'مواد خام مختارة'},
        {label: 'إنتاج مراقب'},
        {label: 'اختبارات أداء'},
        {label: 'عمليات مراقبة الجودة'},
        {label: 'خدمة تركز على رضا العملاء'},
      ],
      badges: [
        {label: '9001:2015'},
        {label: '14001:2015'},
        {label: '45001:2018'},
        {label: 'Made in Türkiye'},
      ],
    },
    cta: {
      eyebrow: 'لنجد الحل المناسب',
      title: 'اعثر على الحل الكيميائي المناسب لأعمالك',
      description: 'تحدث مع فريقنا حول المنتجات والإنتاج بعلامة خاصة والاحتياجات الفنية.',
      quote: 'اطلب عرضاً',
      contact: 'تواصل معنا',
    },
  },
}

export function getHomeCopy(locale: Locale) {
  return copy[locale]
}
