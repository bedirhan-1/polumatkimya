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
  'PARLAMA NOKTASI': {en: 'Flash point', ar: 'نقطة الوميض'},
  'KAYNAMA NOKTASI': {en: 'Boiling point', ar: 'نقطة الغليان'},
  'DONMA NOKTASI': {en: 'Freezing point', ar: 'نقطة التجمد'},
  'KİMYASAL BAZ': {en: 'Chemical base', ar: 'القاعدة الكيميائية'},
  'KIMYASAL BAZ': {en: 'Chemical base', ar: 'القاعدة الكيميائية'},
  'KATILAŞMA SÜRESİ': {en: 'Curing time', ar: 'زمن التصلب'},
  'KATILASMA SURESI': {en: 'Curing time', ar: 'زمن التصلب'},
  'KURUMA SÜRESİ': {en: 'Drying time', ar: 'زمن الجفاف'},
  'KURUMA SURESI': {en: 'Drying time', ar: 'زمن الجفاف'},
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
