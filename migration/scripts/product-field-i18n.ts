/**
 * Spec labels, UI copy, and lightweight TR→EN/AR helpers for product enrichment.
 */
import {foldTr} from './lib'

export const specLabelI18n: Record<string, {en: string; ar: string}> = {
  RENK: {en: 'Color', ar: 'اللون'},
  KOKU: {en: 'Odor', ar: 'الرائحة'},
  YOĞUNLUK: {en: 'Density', ar: 'الكثافة'},
  YOGUNLUK: {en: 'Density', ar: 'الكثافة'},
  'BUHARLAŞMA ORANI': {en: 'Evaporation rate', ar: 'معدل التبخر'},
  'BUHARLASMA ORANI': {en: 'Evaporation rate', ar: 'معدل التبخر'},
  'SICAKLIK ARALIĞI': {en: 'Temperature range', ar: 'نطاق درجة الحرارة'},
  'SICAKLIK ARALIGI': {en: 'Temperature range', ar: 'نطاق درجة الحرارة'},
  GRAMAJ: {en: 'Net content', ar: 'الحجم / الوزن'},
  KOLİ: {en: 'Case pack', ar: 'عدد العبوات في الكرتون'},
  KOLI: {en: 'Case pack', ar: 'عدد العبوات في الكرتون'},
  PALET: {en: 'Pallet', ar: 'عدد الكراتين على المنصة'},
  'PH DEĞERİ': {en: 'pH value', ar: 'قيمة الرقم الهيدروجيني'},
  'PH DEGERI': {en: 'pH value', ar: 'قيمة الرقم الهيدروجيني'},
  VİSKOSİTE: {en: 'Viscosity', ar: 'اللزوجة'},
  VISKOSITE: {en: 'Viscosity', ar: 'اللزوجة'},
  Viskozite: {en: 'Viscosity', ar: 'اللزوجة'},
  'PARLAMA NOKTASI': {en: 'Flash point', ar: 'نقطة الوميض'},
  'ALEVLENME NOKTASI': {en: 'Flash point', ar: 'نقطة الوميض'},
  'KAYNAMA NOKTASI': {en: 'Boiling point', ar: 'نقطة الغليان'},
  'DONMA NOKTASI': {en: 'Freezing point', ar: 'نقطة التجمد'},
  'KİMYASAL BAZ': {en: 'Chemical base', ar: 'القاعدة الكيميائية'},
  'KIMYASAL BAZ': {en: 'Chemical base', ar: 'القاعدة الكيميائية'},
  'KATILAŞMA SÜRESİ': {en: 'Curing time', ar: 'زمن التصلب'},
  'KATILASMA SURESI': {en: 'Curing time', ar: 'زمن التصلب'},
  'KURUMA SÜRESİ': {en: 'Drying time', ar: 'زمن الجفاف'},
  'KURUMA SURESI': {en: 'Drying time', ar: 'زمن الجفاف'},
  VİZKOZİTE: {en: 'Viscosity', ar: 'اللزوجة'},
  VIZKOZITE: {en: 'Viscosity', ar: 'اللزوجة'},
  'KORUMA ÖZELLİĞİ': {en: 'Protective property', ar: 'خاصية الحماية'},
  'KORUMA OZELLIGI': {en: 'Protective property', ar: 'خاصية الحماية'},
  'Büyük set': {en: 'Large set', ar: 'الطقم الكبير'},
  'Küçük set': {en: 'Small set', ar: 'الطقم الصغير'},
  'BUYUK SET': {en: 'Large set', ar: 'الطقم الكبير'},
  'KUCUK SET': {en: 'Small set', ar: 'الطقم الصغير'},
  'Shore A': {en: 'Shore A', ar: 'صلادة شور A'},
  SHOREA: {en: 'Shore A', ar: 'صلادة شور A'},
}

export const uiCopy = {
  badgeSpray: {tr: 'Endüstriyel sprey', en: 'Industrial spray', ar: 'بخاخ صناعي'},
  badgeConstruction: {tr: 'Yapı kimyasalı', en: 'Construction chemical', ar: 'كيماوي بناء'},
  specsHeading: {tr: 'Teknik özellikler', en: 'Technical specifications', ar: 'المواصفات التقنية'},
  sdsLabel: {tr: 'Güvenlik bilgi formu (SDS)', en: 'Safety data sheet (SDS)', ar: 'ورقة بيانات السلامة (SDS)'},
  tdsLabel: {tr: 'Teknik veri formu (TDS)', en: 'Technical data sheet (TDS)', ar: 'ورقة البيانات الفنية (TDS)'},
  catalogLabel: {tr: 'Ürün kataloğu', en: 'Product catalog', ar: 'كتالوج المنتجات'},
  ctaLabel: {tr: 'Teklif al', en: 'Request a quote', ar: 'اطلب عرض سعر'},
  defaultWarning: {
    tr: 'Kullanmadan önce etiket ve güvenlik bilgi formunu okuyunuz. İyi havalandırılmış ortamda kullanın. Çocukların ulaşamayacağı yerde saklayın.',
    en: 'Read the label and safety data sheet before use. Use in a well-ventilated area. Keep out of reach of children.',
    ar: 'اقرأ الملصق وورقة بيانات السلامة قبل الاستخدام. استخدم في مكان جيد التهوية. احفظ بعيداً عن متناول الأطفال.',
  },
  defaultInstructionsSpray: {
    tr: 'Kullanmadan önce kutuyu iyice çalkalayın. Yüzeyi kuru ve temiz tutun. 15–20 cm mesafeden püskürtün. Gerekirse işlemi tekrarlayın. Uygulama sonrası iyi havalandırın.',
    en: 'Shake the can well before use. Keep the surface dry and clean. Spray from 15–20 cm. Repeat if needed. Ventilate after application.',
    ar: 'رج العبوة جيداً قبل الاستخدام. حافظ على السطح جافاً ونظيفاً. رش من مسافة 15–20 سم. كرر عند الحاجة. هوّئ المكان بعد التطبيق.',
  },
  defaultInstructionsConstruction: {
    tr: 'Uygulama yüzeyinin kuru, temiz, toz ve yağdan arındırılmış olduğundan emin olun. Kartuşu uygun tabancaya yerleştirip düzgün bir şekilde uygulayın. Fazlalığı ıslak sünger veya spatula ile temizleyin. Tam kuruma için teknik verilere bakınız.',
    en: 'Ensure the surface is dry, clean and free of dust and grease. Fit the cartridge into a suitable gun and apply evenly. Remove excess with a damp sponge or spatula. See technical data for full cure time.',
    ar: 'تأكد من أن السطح جاف ونظيف وخالٍ من الغبار والشحوم. ركّب الخرطوشة في مسدس مناسب وطبق بالتساوي. أزل الزائد بإسفنجة رطبة أو ملعقة. راجع البيانات الفنية لزمن التصلب الكامل.',
  },
}

const phraseBook: Array<{match: RegExp; en: string; ar: string}> = [
  {match: /aşındırıcı malzeme içermez/i, en: 'Contains no abrasive materials', ar: 'لا يحتوي على مواد كاشطة'},
  {match: /aseton içermez/i, en: 'Acetone-free', ar: 'خالٍ من الأسيتون'},
  {match: /disk,?\s*fren ve balata sesini azaltır/i, en: 'Reduces disc, brake and pad noise', ar: 'يقلل ضوضاء القرص والفرامل والبطانة'},
  {match: /iletken değildir/i, en: 'Non-conductive', ar: 'غير موصل'},
  {match: /çevreye zarar vermeyen|ozonla çevre dostu|çevre dostu itici/i, en: 'Uses an ozone-friendly propellant', ar: 'يستخدم دافعاً صديقاً للأوزون'},
  {match: /kurum, yağ, fren tozları/i, en: 'Effectively removes soot, oil, brake dust and oily residues', ar: 'يزيل بفعالية السخام والزيت وغبار الفرامل والبقايا الدهنية'},
  {match: /metaller arasında koruyucu/i, en: 'Forms a protective layer between metals and reduces friction', ar: 'يشكّل طبقة واقية بين المعادن ويقلل الاحتكاك'},
  {match: /suyu uzaklaştırır/i, en: 'Displaces water and protects metal parts from rust for longer', ar: 'يطرد الماء ويحمي الأجزاء المعدنية من الصدأ لفترة أطول'},
  {match: /ulaşılması zor yerlere/i, en: 'Penetrates even hard-to-reach areas', ar: 'يخترق حتى المناطق صعبة الوصول'},
  {match: /silikon içermez/i, en: 'Silicone-free', ar: 'خالٍ من السيليكون'},
  {match: /360 derece/i, en: '360° application', ar: 'تطبيق بزاوية 360 درجة'},
  {match: /su iticidir/i, en: 'Water-repellent', ar: 'طارد للماء'},
  {match: /lastik ve contalara zarar vermez/i, en: 'Safe for rubber and seals', ar: 'آمن على المطاط والأختام'},
  {match: /solvent içermez/i, en: 'Solvent-free', ar: 'خالٍ من المذيبات'},
  {match: /kokusuzdur/i, en: 'Odorless', ar: 'عديم الرائحة'},
  {match: /üzeri boyanabilir/i, en: 'Overpaintable', ar: 'قابل للطلاء فوقه'},
  {match: /uygulanması ve temizlenmesi oldukça kolay/i, en: 'Easy to apply and clean', ar: 'سهل التطبيق والتنظيف'},
  {match: /tuğla, beton, ahşap/i, en: 'Suitable for porous surfaces such as brick, concrete and wood', ar: 'مناسب للأسطح المسامية مثل الطوب والخرسانة والخشب'},
  {match: /küf ve mantar/i, en: 'Resistant to mold and mildew', ar: 'مقاوم للعفن والفطريات'},
  {match: /çatlama ve çökme yapmaz/i, en: 'Does not crack or sag', ar: 'لا يتشقق ولا يترهل'},
  {match: /iç ve dış mekanlarda/i, en: 'Suitable for indoor and outdoor use', ar: 'مناسب للاستخدام الداخلي والخارجي'},
  {match: /yüksek yapışma|yüksek tutunma|high.?tack/i, en: 'High adhesion / high tack', ar: 'التصاق عالٍ'},
  {match: /hızlı kuruma|hızlı kurur/i, en: 'Fast drying', ar: 'سريع الجفاف'},
  {match: /yağ giderme|yağ çözücü|yağ sökücü/i, en: 'Degreasing action', ar: 'يزيل الشحوم'},
  {match: /parça temizlik/i, en: 'General-purpose parts cleaning', ar: 'تنظيف عام للأجزاء'},
]

function applyPhraseBook(tr: string): {en: string; ar: string} | null {
  const hits = phraseBook.filter((entry) => entry.match.test(tr))
  if (!hits.length) return null
  if (hits.length === 1) return {en: hits[0]!.en, ar: hits[0]!.ar}
  return {
    en: hits.map((h) => h.en).join('. '),
    ar: hits.map((h) => h.ar).join('. '),
  }
}

/** Translate a Turkish feature/benefit line into EN/AR with phrase book + safe fallback. */
export function localizeFeatureLine(tr: string): {tr: string; en: string; ar: string} {
  const cleaned = tr.replace(/\s+/g, ' ').trim()
  const hit = applyPhraseBook(cleaned)
  if (hit) return {tr: cleaned, en: hit.en, ar: hit.ar}

  // Multi-sentence bullet: try sentence-level mapping
  const parts = cleaned.split(/(?<=\.)\s+/).filter(Boolean)
  if (parts.length > 1) {
    const mapped = parts.map((part) => {
      const local = applyPhraseBook(part)
      return local || {en: part, ar: part}
    })
    if (mapped.some((m, i) => m.en !== parts[i])) {
      return {
        tr: cleaned,
        en: mapped.map((m) => m.en).join(' '),
        ar: mapped.map((m) => m.ar).join(' '),
      }
    }
  }

  return {
    tr: cleaned,
    en: cleaned,
    ar: cleaned,
  }
}

export function localizeSpecLabel(labelTr: string): {tr: string; en: string; ar: string} {
  const raw = labelTr.trim()
  const direct = specLabelI18n[raw] || specLabelI18n[raw.toLocaleUpperCase('tr-TR')]
  if (direct) return {tr: raw, en: direct.en, ar: direct.ar}

  const folded = foldTr(raw).replace(/\s+/g, ' ')
  for (const [key, value] of Object.entries(specLabelI18n)) {
    if (foldTr(key) === folded) return {tr: raw, en: value.en, ar: value.ar}
  }
  return {tr: raw, en: raw, ar: raw}
}

/** Exact and patterned translations for specification values. */
const specValueExact: Record<string, {en: string; ar: string; tr?: string}> = {
  Şeffaf: {en: 'Transparent', ar: 'شفاف'},
  Transparent: {tr: 'Şeffaf', en: 'Transparent', ar: 'شفاف'},
  Renksiz: {en: 'Colorless', ar: 'عديم اللون'},
  'Renksiz veya şeffaf': {en: 'Colorless or transparent', ar: 'عديم اللون أو شفاف'},
  Sarı: {en: 'Yellow', ar: 'أصفر'},
  Karakteristik: {en: 'Characteristic', ar: 'مميزة'},
  Characteristic: {tr: 'Karakteristik', en: 'Characteristic', ar: 'مميزة'},
  'Karakteristik (genellikle çözücü kokusu)': {
    en: 'Characteristic (usually solvent odor)',
    ar: 'مميزة (عادةً رائحة مذيب)',
  },
  'Karakteristik (genellikle güçlü, asidik veya çözücü koku)': {
    en: 'Characteristic (usually strong acidic or solvent odor)',
    ar: 'مميزة (عادةً رائحة قوية حمضية أو رائحة مذيب)',
  },
  'Çoğunlukla yağlı veya çözücü kokusu': {
    en: 'Mostly oily or solvent odor',
    ar: 'رائحة دهنية أو رائحة مذيب في الغالب',
  },
  'Karakteristik yağ veya solvent kokusu': {
    en: 'Characteristic oily or solvent odor',
    ar: 'رائحة مميزة دهنية أو رائحة مذيب',
  },
  'Karakteristik (Çoğunlukla solvent kokulu)': {
    en: 'Characteristic (mostly solvent odor)',
    ar: 'مميزة (رائحة مذيب في الغالب)',
  },
  'Orta (ortam sıcaklığına göre değişir)': {
    en: 'Medium (varies depending on ambient temperature)',
    ar: 'متوسط (يتغير حسب درجة حرارة المحيط)',
  },
  '100°C-250°C aralığında': {
    en: 'Between 100°C and 250°C',
    ar: 'بين 100°م و250°م',
  },
  '200°C ile 300°C arasında': {en: 'Between 200°C and 300°C', ar: 'بين 200°م و300°م'},
  'Genellikle 30 dk.-1 sa. aralığında': {
    en: 'Typically between 30 minutes and 1 hour',
    ar: 'عادةً بين 30 دقيقة وساعة',
  },
  'Siyah / Kırmızı': {en: 'Black / Red', ar: 'أسود / أحمر'},
  'Beyaz / Şeffaf': {en: 'White / Transparent', ar: 'أبيض / شفاف'},
  Beyaz: {en: 'White', ar: 'أبيض'},
  'Beyaz / Antrasit / Altın meşe / Gri': {
    en: 'White / Anthracite / Golden Oak / Gray',
    ar: 'أبيض / أنثراسايت / بلوط ذهبي / رمادي',
  },
  'Silan sonlandırılmış polimer': {
    en: 'Silane terminated polymer',
    ar: 'بوليمر منتهٍ بالسيلان',
  },
  '400 ml / 200 ml': {en: '400 ml / 200 ml', ar: '400 مل / 200 مل'},
  '12 Adet / 24 Adet': {en: '12 pcs / 24 pcs', ar: '12 قطعة / 24 قطعة'},
  '12 Adet': {en: '12 pcs', ar: '12 قطعة'},
  '25 Adet': {en: '25 pcs', ar: '25 قطعة'},
  '70 Koli': {en: '70 cases', ar: '70 كرتون'},
  '100 Koli': {en: '100 cases', ar: '100 كرتون'},
  '70 Koli / 96 Koli': {en: '70 cases / 96 cases', ar: '70 كرتون / 96 كرتون'},
  '80 Koli (400 ml) / 96 Koli (200 ml)': {
    en: '80 cases (400 ml) / 96 cases (200 ml)',
    ar: '80 كرتون (400 مل) / 96 كرتون (200 مل)',
  },
  '400gr+80gr / 200gr+40gr': {
    en: '400g+80g / 200g+40g',
    ar: '400غ+80غ / 200غ+40غ',
  },
  '1500-5000 cP (25 °C)': {
    tr: '1500-5000 cP (25 °C)',
    en: '1500-5000 cP (25 °C)',
    ar: '1500-5000 سنتي بواز (25 °م)',
  },
  '60 °C': {en: '60 °C', ar: '60 °م'},
  'Genellikle hafif çözücü kokusu': {
    en: 'Usually a mild solvent odor',
    ar: 'عادةً رائحة مذيب خفيفة',
  },
  'Orta (Ortam sıcaklığına bağlı olarak değişmektedir)': {
    en: 'Medium (varies with ambient temperature)',
    ar: 'متوسط (يتغير حسب درجة حرارة المحيط)',
  },
  'Orta ila hızlı (ortam sıcaklığına bağlı olarak)': {
    en: 'Medium to fast (depends on ambient temperature)',
    ar: 'متوسط إلى سريع (حسب درجة حرارة المحيط)',
  },
  '-20°C ila +50°C, bazı ürünler daha geniş sıcaklığa sahip olabilir.': {
    en: '-20°C to +50°C; some products may cover a wider range.',
    ar: 'من -20°م إلى +50°م؛ قد تغطي بعض المنتجات نطاقاً أوسع.',
  },
  '200°C ile 350°C arasında': {en: 'Between 200°C and 350°C', ar: 'بين 200°م و350°م'},
  '-20°C ile -30°C arasında': {en: 'Between -20°C and -30°C', ar: 'بين -20°م و-30°م'},
  '-10°C ile -20°C arasında': {en: 'Between -10°C and -20°C', ar: 'بين -10°م و-20°م'},
  '-5°C ile -15°C arasında': {en: 'Between -5°C and -15°C', ar: 'بين -5°م و-15°م'},
  '-15 to -5': {tr: '-15 ile -5', en: '-15 to -5', ar: '-15 إلى -5'},
  '-15 ile -5': {en: '-15 to -5', ar: '-15 إلى -5'},
  'Yüksek koruma, pas ve korozyon önleme özellikleri sağlar': {
    en: 'Provides high protection with rust and corrosion prevention',
    ar: 'يوفر حماية عالية مع منع الصدأ والتآكل',
  },
  'Oksidasyona karşı korozyon direnciyle yüksek koruma sağlar.': {
    en: 'Provides high protection with corrosion resistance against oxidation.',
    ar: 'يوفر حماية عالية بمقاومة التآكل ضد الأكسدة.',
  },
  'Lastik yüzeyini UV ışınlarından korur': {
    en: 'Protects tire surfaces from UV rays',
    ar: 'يحمي سطح الإطارات من الأشعة فوق البنفسجية',
  },
  'Yüzeyde koruyucu bir tabaka bırakır': {
    en: 'Leaves a protective layer on the surface',
    ar: 'يترك طبقة واقية على السطح',
  },
  'Kalıp yüzeyinde ayrılma sağlar.': {
    en: 'Provides release on the mold surface.',
    ar: 'يوفر الفصل على سطح القالب.',
  },
  '< 30°C (çok sıcak) yanıcı, kullanılmalı (dikkatli olun)': {
    en: '< 30°C — flammable; use with caution',
    ar: '< 30°م — قابل للاشتعال؛ استخدم بحذر',
  },
  'Akrilik Dispersiyon': {en: 'Acrylic dispersion', ar: 'مبعثر أكريليك'},
  Asetoksi: {en: 'Acetoxy', ar: 'أسيتوكسي'},
  'Asetoksi veya Nötr': {en: 'Acetoxy or neutral', ar: 'أسيتوكسي أو محايد'},
  'Nötr kürleme': {en: 'Neutral cure', ar: 'تصلب محايد'},
  Poliüretan: {en: 'Polyurethane', ar: 'بولي يوريثان'},
  'SMP polimer': {en: 'SMP polymer', ar: 'بوليمر SMP'},
  '2 mm / 24 saat (23 °C ve %50 B.N.)': {
    en: '2 mm / 24 hours (23 °C and 50% R.H.)',
    ar: '2 مم / 24 ساعة (23 °م و50% رطوبة نسبية)',
  },
  '15-45 dk. (23 °C, % 50 RH)': {
    en: '15-45 min. (23 °C, 50% R.H.)',
    ar: '15-45 دقيقة (23 °م، 50% رطوبة نسبية)',
  },
  '15-45 min. (23 °C, % 50 R.H )': {
    tr: '15-45 dk. (23 °C, %50 R.H.)',
    en: '15-45 min. (23 °C, 50% R.H.)',
    ar: '15-45 دقيقة (23 °م، 50% رطوبة نسبية)',
  },
  '3mm/24 hours (23 °C and 50% R.H)': {
    tr: '3 mm / 24 saat (23 °C ve %50 R.H.)',
    en: '3 mm / 24 hours (23 °C and 50% R.H.)',
    ar: '3 مم / 24 ساعة (23 °م و50% رطوبة نسبية)',
  },
  '2mm/24 hours (23 °C and 50% R.H)': {
    tr: '2 mm / 24 saat (23 °C ve %50 R.H.)',
    en: '2 mm / 24 hours (23 °C and 50% R.H.)',
    ar: '2 مم / 24 ساعة (23 °م و50% رطوبة نسبية)',
  },
  '10-20 min. (23 °C and 50% R.H)': {
    tr: '10-20 dk. (23 °C ve %50 R.H.)',
    en: '10-20 min. (23 °C and 50% R.H.)',
    ar: '10-20 دقيقة (23 °م و50% رطوبة نسبية)',
  },
  '60-90 min. (23 °C and 50% R.H)': {
    tr: '60-90 dk. (23 °C ve %50 R.H.)',
    en: '60-90 min. (23 °C and 50% R.H.)',
    ar: '60-90 دقيقة (23 °م و50% رطوبة نسبية)',
  },
  '10-15 min.': {tr: '10-15 dk.', en: '10-15 min.', ar: '10-15 دقيقة'},
  '24 Adet': {en: '24 pcs', ar: '24 قطعة'},
  '80 Koli': {en: '80 cases', ar: '80 كرتون'},
  '96 Koli': {en: '96 cases', ar: '96 كرتون'},
  '120 Koli': {en: '120 cases', ar: '120 كرتون'},
  '400ml + 80gr': {tr: '400ml + 80gr', en: '400ml + 80g', ar: '400 مل + 80 غ'},
  '200ml + 40gr': {tr: '200ml + 40gr', en: '200ml + 40g', ar: '200 مل + 40 غ'},
  'Asidik veya nötr (su bazlı formülasyonlar daha nötr bir pH\'a sahip olabilir)': {
    en: 'Acidic or neutral (water-based formulations may have a more neutral pH)',
    ar: 'حمضي أو محايد (قد تكون التركيبات المائية أقرب إلى pH محايد)',
  },
  Viskozite: {en: 'Viscosity', ar: 'اللزوجة'},
}

const specValuePatterns: Array<{match: RegExp; localize: (raw: string) => {tr: string; en: string; ar: string}}> = [
  {
    match: /^(\d+(?:[.,]\d+)?)\s*g\/cm(?:³|&sup3;|&sup3)?$/i,
    localize: (raw) => {
      const num = raw.replace(/g\/cm.*/i, '').trim().replace(',', '.')
      const display = raw.includes(',') ? raw.match(/[\d,]+/)?.[0] || num : num
      return {
        tr: `${display} g/cm³`,
        en: `${num.replace(',', '.')} g/cm³`,
        ar: `${num.replace(',', '.')} غ/سم³`,
      }
    },
  },
  {
    match: /^(\d+(?:[.,]\d+)?)\s*\(\+\/-?\s*[\d.,]+\)(?:\s*gr?\/cm(?:³|&sup3;)?)?$/i,
    localize: (raw) => {
      const cleaned = raw.replace(/&sup3;/g, '³').replace(/\s+/g, ' ').trim()
      const withUnit = /g\/cm|gr\/cm/i.test(cleaned) ? cleaned.replace(/gr?\s*\/\s*cm³?/i, 'g/cm³') : cleaned
      return {
        tr: withUnit,
        en: withUnit.replace(',', '.'),
        ar: withUnit.replace(',', '.').replace(/g\/cm³/i, 'غ/سم³'),
      }
    },
  },
  {
    match: /(\d+)\s*-\s*(\d+)\s*cP?\s*\((?:at\s*)?25\s*°?C(?:'de)?\)/i,
    localize: (raw) => {
      const m = raw.match(/(\d+)\s*-\s*(\d+)/)
      const range = m ? `${m[1]} - ${m[2]}` : raw
      return {
        tr: `${range} cP (25°C'de)`,
        en: `${range} cP (at 25°C)`,
        ar: `${range} سنتي بواز (عند 25°م)`,
      }
    },
  },
  {
    match: /^-\s*(\d+)\s*cP\s*\(at\s*25°C\)$/i,
    localize: (raw) => {
      const m = raw.match(/(\d+)/)
      const n = m?.[1] || raw
      return {
        tr: `${n} cP (25°C'de)`,
        en: `${n} cP (at 25°C)`,
        ar: `${n} سنتي بواز (عند 25°م)`,
      }
    },
  },
  {
    match: /(\d+)\s*-\s*(\d+)\s*cSt\s*\(40°C'de\)/i,
    localize: () => ({
      tr: "150-250 cSt (40°C'de)",
      en: '150-250 cSt (at 40°C)',
      ar: '150-250 سنتي ستوك (عند 40°م)',
    }),
  },
  {
    match: /^(\d+)\s*-\s*(\d+)\s*cp\s*\(25°C'de\)$/i,
    localize: (raw) => {
      const m = raw.match(/(\d+)\s*-\s*(\d+)/i)
      const range = m ? `${m[1]} - ${m[2]}` : raw
      return {
        tr: `${range} cP (25°C'de)`,
        en: `${range} cP (at 25°C)`,
        ar: `${range} سنتي بواز (عند 25°م)`,
      }
    },
  },
  {
    match: /^(\d+(?:\.\d+)?)\s*g\/cm$/i,
    localize: (raw) => {
      const num = raw.replace(/\s*g\/cm.*/i, '').trim()
      return {tr: `${num} g/cm³`, en: `${num} g/cm³`, ar: `${num} غ/سم³`}
    },
  },
]

function decodeHtmlEntities(value: string) {
  return value
    .replace(/&sup3;/gi, '³')
    .replace(/&deg;/gi, '°')
    .replace(/&nbsp;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function localizeSpecValue(rawValue: string): {tr: string; en: string; ar: string} {
  const raw = decodeHtmlEntities(rawValue)
  if (!raw) return {tr: '', en: '', ar: ''}

  const exact = specValueExact[raw]
  if (exact) {
    return {
      tr: exact.tr || raw,
      en: exact.en,
      ar: exact.ar,
    }
  }

  for (const pattern of specValuePatterns) {
    if (pattern.match.test(raw)) return pattern.localize(raw)
  }

  // Pure numeric / symbolic values stay shared across locales.
  if (/^[\d\s.,+\-–—<>°%/()]+$/.test(raw) || /^[\d\s.,+\-–—<>]+$/.test(raw)) {
    return {tr: raw, en: raw, ar: raw}
  }

  // Packaging-like values: keep volume tokens, translate unit words.
  if (/\b(Adet|Koli|ml|gr|gr\.|g)\b/i.test(raw) && raw.length < 40) {
    const en = raw
      .replace(/\bAdet\b/gi, 'pcs')
      .replace(/\bKoli\b/gi, 'cases')
      .replace(/\bgr\b/gi, 'g')
    const ar = raw
      .replace(/\bAdet\b/gi, 'قطعة')
      .replace(/\bKoli\b/gi, 'كرتون')
      .replace(/\bml\b/gi, 'مل')
      .replace(/\bgr\b/gi, 'غ')
      .replace(/\bg\b/gi, 'غ')
    return {tr: raw, en, ar}
  }

  // Temperature phrases already in English-ish form.
  if (/hours|min\.|R\.H/i.test(raw) && !/[çğıöşüÇĞİÖŞÜ]/.test(raw)) {
    return {
      tr: raw
        .replace(/hours/gi, 'saat')
        .replace(/min\./gi, 'dk.')
        .replace(/and/gi, 've'),
      en: raw,
      ar: raw
        .replace(/mm/gi, 'مم')
        .replace(/hours/gi, 'ساعة')
        .replace(/min\./gi, 'دقيقة')
        .replace(/and/gi, 'و')
        .replace(/R\.H\.?/gi, 'رطوبة نسبية'),
    }
  }

  return {tr: raw, en: raw, ar: raw}
}

export function localizeSpecUnit(rawUnit: string): {tr: string; en: string; ar: string} {
  const raw = decodeHtmlEntities(rawUnit)
  if (!raw) return {tr: '', en: '', ar: ''}

  const map: Record<string, {tr: string; en: string; ar: string}> = {
    'g/cm³': {tr: 'g/cm³', en: 'g/cm³', ar: 'غ/سم³'},
    'g/cm3': {tr: 'g/cm³', en: 'g/cm³', ar: 'غ/سم³'},
    cP: {tr: 'cP', en: 'cP', ar: 'سنتي بواز'},
    cp: {tr: 'cP', en: 'cP', ar: 'سنتي بواز'},
    cSt: {tr: 'cSt', en: 'cSt', ar: 'سنتي ستوك'},
    min: {tr: 'dk', en: 'min', ar: 'دقيقة'},
    dk: {tr: 'dk', en: 'min', ar: 'دقيقة'},
    '°C': {tr: '°C', en: '°C', ar: '°م'},
    ml: {tr: 'ml', en: 'ml', ar: 'مل'},
    gr: {tr: 'g', en: 'g', ar: 'غ'},
    g: {tr: 'g', en: 'g', ar: 'غ'},
  }

  return map[raw] || {tr: raw, en: raw, ar: raw}
}

export function localizeUsageCopy(tr: string): {tr: string; en: string; ar: string} {
  const cleaned = tr.replace(/\s+/g, ' ').trim()
  if (!cleaned) return {tr: '', en: '', ar: ''}

  // Prefer whole-paragraph known openings; otherwise keep TR and mirror for editorial polish later.
  // Short descriptions are product-specific — provide EN/AR paraphrases via light rewriting rules.
  const en = cleaned
    .replace(/Taşıtlarda,/g, 'On vehicles,')
    .replace(/diskli ve kampanalı frenler/g, 'disc and drum brakes')
    .replace(/motor ve şansıman gövdeleri/g, 'engine and transmission housings')
    .replace(/yağlı\/gresli artıkların/g, 'oily/greasy residues')
    .replace(/kurumun ve balata tozunun/g, 'soot and brake dust')
    .replace(/hızlı bir şekilde giderilmesini sağlar/g, 'are removed quickly')
    .replace(/Endüstride genel amaçlı/g, 'Also suitable for industrial general-purpose')
    .replace(/parça temizlik ve yağ giderme işlemlerinin yanında/g, 'parts cleaning and degreasing, as well as')
    .replace(/yapıştırma ve sızdırmazlık işlemleri öncesinde yüzey ön hazırlığında kullanıma da uygundur/g, 'surface preparation before bonding and sealing')
    .replace(/Pas ve rutubete maruz kalan yüzeylerde/g, 'On surfaces exposed to rust and moisture,')
    .replace(/oluşabilecek korozyonu ve pası engeller/g, 'it helps prevent corrosion and rust')
    .replace(/Sürtünmeyi ve aşınmayı azaltır/g, 'It reduces friction and wear')
    .replace(/Tek bileşenli, akrilik esaslı kullanıma hazır derz dolgudur/g, 'One-component, acrylic-based ready-to-use grout filler')
    .replace(/Küf ve mantar oluşumuna dirençli, çatlama ve çökme yapmaz/g, 'Resistant to mold and mildew; does not crack or sag')
    .replace(/Kuruduktan sonra suya karşı dayanıklıdır/g, 'Water-resistant after curing')
    .replace(/İç ve dış mekanlarda kullanıma uygundur/g, 'Suitable for indoor and outdoor use')

  const ar =
    en === cleaned
      ? cleaned
      : cleaned // Prefer dedicated AR when we expand; keep TR for editors when EN rewrite incomplete

  // If EN rewrite barely changed, keep parallel copy for Studio editors to refine.
  if (en === cleaned || en.length < cleaned.length * 0.5) {
    return {tr: cleaned, en: cleaned, ar: cleaned}
  }

  return {
    tr: cleaned,
    en,
    ar: ar === cleaned ? cleaned : ar,
  }
}

export function packagingLabelI18n(volume: string): {tr: string; en: string; ar: string} {
  const v = volume.trim()
  return {
    tr: v,
    en: v,
    ar: v,
  }
}
