/**
 * Official Polumat catalog (polimat_tekli-web.pdf) product content — TR/EN/AR.
 * Used by enrich-products-from-catalog.ts
 */
import {
  localizeSpecLabel,
  localizeSpecUnit,
  localizeSpecValue,
} from './product-field-i18n'

export type Loc = {tr: string; en: string; ar: string}

export type CatalogSpec = {
  label: Loc
  value: Loc
  unit?: Loc
  note?: Loc
}

export type CatalogPack = {
  volume: string
  label: Loc
}

export type CatalogProduct = {
  slug: string
  title: Loc
  shortDescription: Loc
  body: Loc
  benefits: Array<{title: Loc; description: Loc}>
  features: Array<{title: Loc; description: Loc}>
  packaging: CatalogPack[]
  specs: CatalogSpec[]
}

function L(tr: string, en: string, ar: string): Loc {
  return {tr, en, ar}
}

function spec(labelTr: string, valueRaw: string, unitRaw?: string): CatalogSpec {
  const label = localizeSpecLabel(labelTr)
  // Prefer title-case labels from catalog where localize returns UPPERCASE keys
  const niceLabel: Loc = {
    tr: label.tr,
    en: label.en,
    ar: label.ar,
  }
  const value = localizeSpecValue(valueRaw)
  const unit = unitRaw ? localizeSpecUnit(unitRaw) : undefined
  return unit ? {label: niceLabel, value, unit} : {label: niceLabel, value}
}

function pack(volume: string, tr?: string, en?: string, ar?: string): CatalogPack {
  return {
    volume,
    label: L(tr || volume, en || volume, ar || volume),
  }
}

export const CATALOG_PRODUCTS: CatalogProduct[] = [
  {
    slug: 'brake-cleaner-spray',
    title: L('Fren Balata Temizleyici Sprey', 'Brake Cleaner', 'بخاخ منظف تيل الفرامل'),
    shortDescription: L(
      'Fren balatalarındaki kir, toz, yağ ve diğer kalıntıları temizlemek için çevreye zarar vermeyen formüllerle üretilir.',
      'Brake pad spray produced with environmentally friendly formulas to clean dirt, dust, oil and other residues on brake pads.',
      'بخاخ تيل فرامل يُنتج بتركيبات صديقة للبيئة لتنظيف الأوساخ والغبار والزيت والمخلفات على بطانات الفرامل.',
    ),
    body: L(
      'FREN BALATA SPREYİ; çevreye zarar vermeyen formüllerle üretilir. Fren balatalarındaki kir, toz, yağ ve diğer kalıntıları temizlemek amacıyla kullanılır. Bu sayede hem aracınızın bakımını yaparken hem de çevreyi koruyabilirsiniz. Bu spreyler genellikle hızlı kuruma özelliğine sahip olup, fren sistemine zarar vermeden etkili bir temizlik sağlar. Ayrıca, fren performansını olumsuz etkileyebilecek kalıntıları ortadan kaldırarak frenlerin daha verimli çalışmasına yardımcı olur.\n\nUygulama Sonrası: Fren performansını artırma, kir ve toz giderme, ses azaltma gibi birçok avantajı bulunmaktadır.',
      'BRAKE CLEANER; Brake pad spray is produced with formulas that do not harm the environment. It is used to clean dirt, dust, oil and other residues on brake pads. In this way, you can protect the environment while maintaining your vehicle. These sprays generally dry fast and provide effective cleaning without damaging the brake system. They also help brakes work more efficiently by eliminating residues that can negatively affect brake performance.\n\nAfter application: Increasing brake performance, removing dirt and dust, and reducing sound.',
      'بخاخ تيل الفرامل يُنتج بتركيبات لا تضر بالبيئة. يُستخدم لتنظيف الأوساخ والغبار والزيت والمخلفات على بطانات الفرامل، فيحمي البيئة مع العناية بسيارتك. يجف عادة بسرعة ويوفر تنظيفاً فعالاً دون الإضرار بنظام الفرامل، ويساعد على عمل الفرامل بكفاءة أعلى بإزالة المخلفات المؤثرة على الأداء.\n\nبعد التطبيق: زيادة أداء الفرامل، إزالة الأوساخ والغبار، وتقليل الصوت.',
    ),
    benefits: [
      {title: L('Fren verimliliğini artırma', 'Improving braking efficiency', 'زيادة كفاءة الفرامل'), description: L('Kalıntıları temizleyerek fren performansını destekler.', 'Supports brake performance by removing residues.', 'يدعم أداء الفرامل بإزالة المخلفات.')},
      {title: L('Kir ve toz giderme', 'Dirt and dust removal', 'إزالة الأوساخ والغبار'), description: L('Balata yüzeylerindeki kir ve tozu etkili temizler.', 'Effectively cleans dirt and dust from pad surfaces.', 'ينظف بفعالية الأوساخ والغبار عن أسطح البطانات.')},
      {title: L('Ses azaltma', 'Sound reduction', 'تقليل الصوت'), description: L('Fren ve balata sesinin azalmasına yardımcı olur.', 'Helps reduce brake and pad noise.', 'يساعد على تقليل ضوضاء الفرامل والبطانات.')},
    ],
    features: [
      {title: L('Hızlı kuruma', 'Fast drying', 'جفاف سريع'), description: L('Uygulama sonrası hızlı kurur.', 'Dries quickly after application.', 'يجف بسرعة بعد التطبيق.')},
      {title: L('Fren sistemine zarar vermez', 'Safe for brake system', 'آمن على نظام الفرامل'), description: L('Etkili temizlik sağlar, fren sistemine zarar vermez.', 'Cleans effectively without damaging the brake system.', 'ينظف بفعالية دون الإضرار بنظام الفرامل.')},
      {title: L('Çevreye duyarlı formül', 'Environmentally conscious formula', 'تركيبة صديقة للبيئة'), description: L('Çevreye zarar vermeyen formüllerle üretilir.', 'Produced with formulas that do not harm the environment.', 'يُنتج بتركيبات لا تضر بالبيئة.')},
    ],
    packaging: [pack('500 ml')],
    specs: [
      spec('RENK', 'Renksiz veya şeffaf'),
      spec('KOKU', 'Karakteristik'),
      spec('YOĞUNLUK', '1,2 g/cm³'),
      spec('BUHARLAŞMA ORANI', 'Orta (ortam sıcaklığına göre değişir)'),
      spec('SICAKLIK ARALIĞI', '-20°C ila +50°C, bazı ürünler daha geniş sıcaklığa sahip olabilir.'),
      spec('GRAMAJ', '500 ml'),
      spec('KOLİ', '24 Adet'),
      spec('PALET', '70 Koli'),
    ],
  },
  {
    slug: 'engine-cleaner-spray',
    title: L('Motor Temizleyici Sprey', 'Engine Cleaning Spray', 'بخاخ تنظيف المحرك'),
    shortDescription: L(
      'Yıkama gerektirmeyen motor temizleyici; binek araç, motosiklet ve benzeri tüm motor tiplerinde zorlu kirleri temizler.',
      'No-rinse engine cleaner for passenger vehicles, motorcycles and similar engines; removes tough dirt.',
      'منظف محرك بدون شطف لسيارات الركاب والدراجات النارية والمحركات المماثلة؛ يزيل الأوساخ العنيدة.',
    ),
    body: L(
      'MOTOR TEMİZLEME SPREYİ; Motor üzerindeki zorlu kirleri temizlemek için, binek araç, motosiklet, çim biçme makinesi ve benzeri tüm motor tipleri için uygun, yıkama gerektirmeyen motor temizleyicidir. Temizleme işlemine ek olarak parlak bir görünüm kazandırır ve motor yüzeyinde koruma sağlar. Üstün içeriği sayesinde motor üzerindeki ulaşılması zor olan noktalara rahatlıkla ulaşır, kolayca nüfuz eder ve temizler. Elektronik devrelere zarar vermez. Kauçuk, plastik ve boyalı yüzeylere zarar vermez.\n\nUygulama Sonrası: Motorun daha verimli çalışmasını sağlar ve ömrünü uzatır.',
      'ENGINE CLEANING SPRAY; It is an engine cleaner that does not require washing, suitable for all engine types such as passenger vehicles, motorcycles, lawn mowers and similar, to clean tough dirt on the engine. In addition to cleaning, it gives a shiny appearance and protects the engine surface. Thanks to its superior content, it easily reaches, penetrates and cleans hard-to-reach areas. It does not damage electronic circuits, rubber, plastic or painted surfaces.\n\nAfter application: Helps the engine operate more efficiently and extends its life.',
      'بخاخ تنظيف المحرك؛ منظف محرك بدون شطف مناسب لجميع أنواع المحركات مثل سيارات الركاب والدراجات النارية وجزازات العشب وما شابه، لإزالة الأوساخ العنيدة. بالإضافة إلى التنظيف يمنح مظهراً لامعاً ويحمي سطح المحرك. بفضل تركيبته المتفوقة يصل بسهولة إلى المناطق صعبة الوصول ويخترقها وينظفها. لا يضر الدوائر الإلكترونية ولا المطاط والبلاستيك والأسطح المطلية.\n\nبعد التطبيق: يساعد المحرك على العمل بكفاءة أعلى ويطيل عمره.',
    ),
    benefits: [
      {title: L('Parlak görünüm', 'Bright appearance', 'مظهر لامع'), description: L('Temizlik sonrası parlak görünüm kazandırır.', 'Leaves a shiny finish after cleaning.', 'يمنح لمسة لامعة بعد التنظيف.')},
      {title: L('Kir ve toz giderme', 'Dirt and dust removal', 'إزالة الأوساخ والغبار'), description: L('Zorlu kirleri etkili şekilde temizler.', 'Effectively removes tough dirt.', 'يزيل الأوساخ العنيدة بفعالية.')},
      {title: L('Antistatik toz koruma', 'Antistatic dust protection', 'حماية مضادة للكهرباء الساكنة'), description: L('Motor yüzeyinde koruma sağlar.', 'Provides protection on the engine surface.', 'يوفر حماية على سطح المحرك.')},
    ],
    features: [
      {title: L('Yıkama gerektirmez', 'No rinsing required', 'لا يحتاج شطفاً'), description: L('Uygulama sonrası yıkama ihtiyacı yoktur.', 'No washing needed after application.', 'لا حاجة للشطف بعد التطبيق.')},
      {title: L('Elektronik devrelere zarar vermez', 'Safe for electronics', 'آمن على الإلكترونيات'), description: L('Elektronik devrelere zarar vermez.', 'Does not damage electronic circuits.', 'لا يضر الدوائر الإلكترونية.')},
      {title: L('Yüzeylere zarar vermez', 'Surface-safe', 'آمن على الأسطح'), description: L('Kauçuk, plastik ve boyalı yüzeylere zarar vermez.', 'Does not damage rubber, plastic or painted surfaces.', 'لا يضر المطاط والبلاستيك والأسطح المطلية.')},
    ],
    packaging: [pack('500 ml')],
    specs: [
      spec('RENK', 'Renksiz veya şeffaf'),
      spec('KOKU', 'Karakteristik (Çoğunlukla solvent kokulu)'),
      spec('YOĞUNLUK', '0.84 g/cm³'),
      spec('PARLAMA NOKTASI', '> 60°C'),
      spec('KAYNAMA NOKTASI', '100°C-250°C aralığında'),
      spec('GRAMAJ', '500 ml'),
      spec('KOLİ', '24 Adet'),
      spec('PALET', '70 Koli'),
    ],
  },
  {
    slug: 'chain-lubricant-spray',
    title: L('Sıvı Gress Zincir Yağlayıcı Sprey', 'Liquid Grease Chain Lubricant', 'بخاخ تشحيم السلاسل السائل'),
    shortDescription: L(
      'Çok amaçlı yağlama spreyi; sürtünmeyi ve aşınmayı azaltır, su iticidir, silikon içermez, 360° uygulanabilir.',
      'Multi-purpose lubricating spray; reduces friction and wear, water-repellent, silicone-free, 360° application.',
      'بخاخ تشحيم متعدد الأغراض؛ يقلل الاحتكاك والتآكل، طارد للماء، خالٍ من السيليكون، تطبيق 360 درجة.',
    ),
    body: L(
      'SIVI GRESS ZİNCİR YAĞLAYICI; Çok amaçlı yağlama spreyidir. Sürtünmeyi ve aşınmayı azaltır. Endüstriyel birçok alanda, ayrıca evde ve iş yerlerinde yağlama gerektiren tüm yüzeylerde güvenle kullanılır. Hareketli parçaların sürtünme mukavemetini artırarak arızaları geciktirir ya da engellemesine yardımcı olur. Ardında bıraktığı yağlı yüzey sayesinde, bakım aralıklarını uzatarak maliyet kazancı sağlar. Su iticidir. Silikon içermez. 360 derece uygulanabilir.',
      'LIQUID GREASE CHAIN LUBRICANT; It is a multi-purpose lubricating spray. Reduces friction and abrasion. It can be used safely on all surfaces that require lubrication in many industrial areas, as well as at home and at work. It delays or helps prevent malfunctions by increasing the friction strength of moving parts. Thanks to the oily surface it leaves behind, it extends maintenance intervals and provides cost savings. It is waterproof. It does not contain silicone. It can be applied 360 degrees.',
      'مادة تشحيم السلسلة؛ بخاخ تشحيم متعدد الأغراض يقلل الاحتكاك والتآكل. يمكن استخدامه بأمان على جميع الأسطح التي تتطلب التشحيم في المجالات الصناعية والمنزل والعمل. يؤخر الأعطال أو يساعد على منعها بزيادة مقاومة الاحتكاك للأجزاء المتحركة. بفضل السطح الزيتي الذي يتركه يطيل فترات الصيانة ويوفر التكلفة. طارد للماء، خالٍ من السيليكون، وقابل للتطبيق بزاوية 360 درجة.',
    ),
    benefits: [
      {title: L('Silikon içermez', 'Silicone free', 'خالٍ من السيليكون'), description: L('Formülünde silikon yoktur.', 'Contains no silicone.', 'لا يحتوي على سيليكون.')},
      {title: L('Su itici', 'Water repellent', 'طارد للماء'), description: L('Su itici özellik sağlar.', 'Provides water-repellent performance.', 'يوفر أداءً طارداً للماء.')},
      {title: L('Sürtünmeye karşı koruma', 'Protection against friction', 'حماية ضد الاحتكاك'), description: L('Sürtünmeyi ve aşınmayı azaltır.', 'Reduces friction and abrasion.', 'يقلل الاحتكاك والتآكل.')},
    ],
    features: [
      {title: L('360° uygulama', '360° application', 'تطبيق 360 درجة'), description: L('Her açıdan uygulanabilir.', 'Can be applied from any angle.', 'يمكن تطبيقه من أي زاوية.')},
      {title: L('Bakım aralığını uzatır', 'Extends maintenance intervals', 'يطيل فترات الصيانة'), description: L('Yağlı film tabakası bakım aralıklarını uzatır.', 'Oily film extends maintenance intervals.', 'الفيلم الزيتي يطيل فترات الصيانة.')},
    ],
    packaging: [pack('400 ml')],
    specs: [
      spec('RENK', 'Sarı'),
      spec('KOKU', 'Karakteristik yağ veya solvent kokusu'),
      spec('YOĞUNLUK', '0.94 g/cm³'),
      spec('VİZKOZİTE', '150-250 cSt (40°C\'de)'),
      spec('PARLAMA NOKTASI', '> 150°C'),
      spec('KAYNAMA NOKTASI', '200°C ile 300°C arasında'),
      spec('KORUMA ÖZELLİĞİ', 'Yüksek koruma, pas ve korozyon önleme özellikleri sağlar'),
      spec('GRAMAJ', '400 ml'),
      spec('KOLİ', '24 Adet'),
      spec('PALET', '70 Koli'),
    ],
  },
  {
    slug: 'contact-cleaner-spray',
    title: L('Kontak Temizleyici Sprey', 'Electronic Card Cleaning Spray', 'بخاخ تنظيف البطاقات الإلكترونية'),
    shortDescription: L(
      'Suyu ve nemi yüzeyden uzak tutarak elektrikli cihazlarda koruyucu tabaka oluşturan, antistatik ve yağ içermeyen sprey.',
      'Spray that keeps water and moisture away and forms a protective layer on electrical devices; antistatic and oil-free.',
      'بخاخ يبعد الماء والرطوبة ويشكّل طبقة واقية على الأجهزة الكهربائية؛ مضاد للكهرباء الساكنة وخالٍ من الزيت.',
    ),
    body: L(
      'ELEKTRONİK KART TEMİZLEME SPREYİ; Suyu ve nemi yüzeyden uzak tutarak, elektrikli cihazlarda koruyucu tabaka oluşturan spreydir. Kolay uygulanabilir. Etkin formülü sayesinde hızlı kuruma sağlar. Hassas yüzeyleri temizlemek için özel olarak hazırlanmıştır. Makine, ekipman, televizyon, bilgisayar, faks, santral, fotokopi gibi tüm aletlerde kullanılabilir. Antistatiktir. Yağ içermez.',
      'ELECTRONIC CARD CLEANING SPRAY; It creates a protective layer on electrical devices by keeping water and moisture away from the surface. Easy to apply. Fast drying thanks to its effective formula. Specially prepared for cleaning sensitive surfaces. Can be used on machinery, equipment, TV, computer, fax, switchboard, photocopier and similar devices. Antistatic. Does not contain oil.',
      'بخاخ تنظيف البطاقات الإلكترونية؛ يشكّل طبقة واقية على الأجهزة الكهربائية بإبعاد الماء والرطوبة عن السطح. سهل التطبيق ويجف بسرعة بفضل تركيبته الفعالة. مُعد خصيصاً لتنظيف الأسطح الحساسة. يمكن استخدامه على الآلات والمعدات والتلفزيون والكمبيوتر والفاكس ولوحة المفاتيح وآلة التصوير وما شابه. مضاد للكهرباء الساكنة ولا يحتوي على زيت.',
    ),
    benefits: [
      {title: L('Antistatik toz koruma', 'Antistatic dust protection', 'حماية مضادة للكهرباء الساكنة'), description: L('Antistatik özellik sağlar.', 'Provides antistatic performance.', 'يوفر أداءً مضاداً للكهرباء الساكنة.')},
      {title: L('Hassas yüzey temizliği', 'Delicate surface cleaning', 'تنظيف الأسطح الحساسة'), description: L('Hassas yüzeyler için özel hazırlanmıştır.', 'Specially prepared for sensitive surfaces.', 'مُعد خصيصاً للأسطح الحساسة.')},
      {title: L('Su itici', 'Water repellent', 'طارد للماء'), description: L('Suyu ve nemi yüzeyden uzak tutar.', 'Keeps water and moisture away from the surface.', 'يبعد الماء والرطوبة عن السطح.')},
    ],
    features: [
      {title: L('Hızlı kuruma', 'Fast drying', 'جفاف سريع'), description: L('Etkin formülü sayesinde hızlı kurur.', 'Dries fast thanks to its effective formula.', 'يجف بسرعة بفضل تركيبته الفعالة.')},
      {title: L('Yağ içermez', 'Oil-free', 'خالٍ من الزيت'), description: L('Formülünde yağ yoktur.', 'Contains no oil.', 'لا يحتوي على زيت.')},
    ],
    packaging: [pack('200 ml')],
    specs: [
      spec('RENK', 'Şeffaf'),
      spec('KOKU', 'Karakteristik'),
      spec('YOĞUNLUK', '0,9 g/cm³'),
      spec('VİZKOZİTE', '1 - 5 cp (25°C\'de)'),
      spec('ALEVLENME NOKTASI', '< 30°C (çok sıcak) yanıcı, kullanılmalı (dikkatli olun)'),
      spec('BUHARLAŞMA ORANI', 'Orta ila hızlı (ortam sıcaklığına bağlı olarak)'),
      spec('DONMA NOKTASI', '-20°C ile -30°C arasında'),
      spec('KORUMA ÖZELLİĞİ', 'Oksidasyona karşı korozyon direnciyle yüksek koruma sağlar.'),
      spec('GRAMAJ', '200 ml'),
      spec('KOLİ', '24 Adet'),
      spec('PALET', '96 Koli'),
    ],
  },
  {
    slug: 'rust-remover-spray',
    title: L('Pas Sökücü Sprey', 'Rust Remover Spray', 'بخاخ مزيل الصدأ'),
    shortDescription: L(
      'Pas ve rutubete maruz kalan yüzeylerde korozyonu engeller; sürtünmeyi azaltır, su iticidir, silikon içermez, 360° uygulanabilir.',
      'Prevents corrosion on surfaces exposed to rust and humidity; reduces friction, water-repellent, silicone-free, 360° application.',
      'يمنع التآكل على الأسطح المعرضة للصدأ والرطوبة؛ يقلل الاحتكاك، طارد للماء، خالٍ من السيليكون، تطبيق 360 درجة.',
    ),
    body: L(
      'PAS SÖKÜCÜ SPREY; Pas ve rutubete maruz kalan yüzeylerde oluşabilecek korozyonu ve pası engeller. Sürtünmeyi ve aşınmayı azaltır. Endüstriyel birçok alanda, ayrıca evde ve iş yerlerinde korozyona uğramış tüm yüzeylerde güvenle kullanılır. Hareketli parçaların sürtünme mukavemetini artırarak arızaları geciktirir ya da engellemesine yardımcı olur. Ardında bıraktığı yağlı yüzey sayesinde, bakım aralıklarını uzatır, yedek parça tasarrufuyla maliyet kazancı sağlar. Pası giderdikten sonra, yüzeyde ince bir film tabakası oluşturarak daha sonraki evrelerdeki paslanmayı geciktirir. Su iticidir. Lastik ve contalara zarar vermez. Silikon içermez. 360 derece uygulanabilir.',
      'RUST REMOVER SPRAY; Prevents corrosion and rust on surfaces exposed to rust and humidity. Reduces friction and abrasion. Safe on corroded surfaces in industrial areas as well as home and workplace. Increases friction resistance of moving parts and helps prevent malfunctions. The oily film extends maintenance intervals and saves on spare parts. After removing rust, a thin film delays further rusting. Water-repellent. Does not damage tires and seals. Silicone-free. 360° application.',
      'بخاخ مزيل الصدأ؛ يمنع التآكل والصدأ على الأسطح المعرضة للصدأ والرطوبة. يقلل الاحتكاك والتآكل. آمن على الأسطح المتآكلة في المجالات الصناعية والمنزل والعمل. يزيد مقاومة الاحتكاك للأجزاء المتحركة ويساعد على منع الأعطال. الفيلم الزيتي يطيل فترات الصيانة ويوفر قطع الغيار. بعد إزالة الصدأ يشكّل طبقة رقيقة تؤخر الصدأ لاحقاً. طارد للماء، لا يضر الإطارات والأختام، خالٍ من السيليكون، وتطبيق 360 درجة.',
    ),
    benefits: [
      {title: L('Silikon içermez', 'Silicone free', 'خالٍ من السيليكون'), description: L('Formülünde silikon yoktur.', 'Contains no silicone.', 'لا يحتوي على سيليكون.')},
      {title: L('Su itici', 'Water repellent', 'طارد للماء'), description: L('Su itici özellik sağlar.', 'Provides water-repellent performance.', 'يوفر أداءً طارداً للماء.')},
      {title: L('Paslanma geciktirici', 'Rust retardant', 'مؤخر للصدأ'), description: L('İnce film tabakası sonraki paslanmayı geciktirir.', 'Thin film delays later rusting.', 'فيلم رقيق يؤخر الصدأ لاحقاً.')},
    ],
    features: [
      {title: L('360° uygulama', '360° application', 'تطبيق 360 درجة'), description: L('Her açıdan uygulanabilir.', 'Can be applied from any angle.', 'يمكن تطبيقه من أي زاوية.')},
      {title: L('Lastik ve contalara zarar vermez', 'Safe for tires and seals', 'آمن على الإطارات والأختام'), description: L('Lastik ve contalara zarar vermez.', 'Does not damage tires and seals.', 'لا يضر الإطارات والأختام.')},
    ],
    packaging: [pack('400 ml'), pack('200 ml')],
    specs: [
      spec('RENK', 'Renksiz'),
      spec('KOKU', 'Karakteristik (genellikle güçlü, asidik veya çözücü koku)'),
      spec('YOĞUNLUK', '0.94 g/cm³'),
      spec('PH DEĞERİ', 'Asidik veya nötr (su bazlı formülasyonlar daha nötr bir pH\'a sahip olabilir)'),
      spec('PARLAMA NOKTASI', '> 60°C'),
      spec('KAYNAMA NOKTASI', '150°C'),
      spec('DONMA NOKTASI', '-20°C'),
      spec('GRAMAJ', '400 ml / 200 ml'),
      spec('KOLİ', '24 Adet'),
      spec('PALET', '80 Koli (400 ml) / 96 Koli (200 ml)'),
    ],
  },
  {
    slug: 'tire-shine-spray',
    title: L('Lastik Parlatıcı Sprey', 'Tire Shine Spray', 'بخاخ تلميع الإطارات'),
    shortDescription: L(
      'Lastiklerdeki kir, toz ve yağın derinlemesine temizliğinde kullanılır; UV ve kurumaya karşı koruyucu film oluşturur.',
      'Used for deep cleaning of dirt, dust and oil on tires; forms a protective film against UV, drying and cracking.',
      'يُستخدم للتنظيف العميق للأوساخ والغبار والزيت على الإطارات؛ يشكّل فيلماً واقياً ضد الأشعة فوق البنفسجية والجفاف والتشقق.',
    ),
    body: L(
      'LASTİK PARLATICI SPREY; Genel amaçlı bir temizleme spreyi olup, lastiklerin üzerinde yer alan kir, toz ve yağın derinlemesine temizliğinde kullanılır. Kuruma, çatlama ve güneş ışınlarına karşı koruyucu bir film tabakası oluşturur. Aracın lastiklerine ilk günkü gibi parlaklık verir. Anti-statiktir. Toz yapışmasını uzun süre geciktirir.',
      'TIRE SHINE SPRAY; A general-purpose cleaning spray used for deep cleaning of dirt, dust and oil on tires. It creates a protective film against drying, cracking and sunlight. Makes vehicle tires shine like the first day. Antistatic. Delays dust adhesion for a long time.',
      'بخاخ تلميع الإطارات؛ بخاخ تنظيف عام للتنظيف العميق للأوساخ والغبار والزيت على الإطارات. يشكّل فيلماً واقياً ضد الجفاف والتشقق وأشعة الشمس. يجعل إطارات السيارة تلمع كاليوم الأول. مضاد للكهرباء الساكنة ويؤخر التصاق الغبار لفترة طويلة.',
    ),
    benefits: [
      {title: L('UV koruma', 'UV protection', 'حماية من الأشعة فوق البنفسجية'), description: L('Lastik yüzeyini UV ışınlarından korur.', 'Protects the tire surface from UV rays.', 'يحمي سطح الإطار من الأشعة فوق البنفسجية.')},
      {title: L('Kurumaya karşı koruma', 'Protection from drying', 'حماية من الجفاف'), description: L('Kuruma ve çatlamaya karşı film tabakası oluşturur.', 'Forms a film against drying and cracking.', 'يشكّل فيلماً ضد الجفاف والتشقق.')},
      {title: L('Antistatik toz koruma', 'Antistatic dust protection', 'حماية مضادة للكهرباء الساكنة'), description: L('Toz yapışmasını uzun süre geciktirir.', 'Delays dust adhesion for a long time.', 'يؤخر التصاق الغبار لفترة طويلة.')},
    ],
    features: [
      {title: L('İlk günkü parlaklık', 'Like-new shine', 'لمعان كاليوم الأول'), description: L('Lastiklere ilk günkü gibi parlaklık verir.', 'Makes tires shine like the first day.', 'يمنح الإطارات لمعاناً كاليوم الأول.')},
      {title: L('Esneklik desteği', 'Supports flexibility', 'دعم المرونة'), description: L('Esnekliği artırır, matlaşmayı önler.', 'Increases flexibility and prevents fading.', 'يزيد المرونة ويمنع البهتان.')},
    ],
    packaging: [pack('500 ml')],
    specs: [
      spec('RENK', 'Şeffaf'),
      spec('KOKU', 'Karakteristik'),
      spec('YOĞUNLUK', '1,1 g/cm³'),
      spec('VİZKOZİTE', '10 - 30 cP (at 25°C)'),
      spec('ALEVLENME NOKTASI', '> 60°C'),
      spec('BUHARLAŞMA ORANI', 'Orta ila hızlı (ortam sıcaklığına bağlı olarak)'),
      spec('DONMA NOKTASI', '-10°C ile -20°C arasında'),
      spec('KORUMA ÖZELLİĞİ', 'Lastik yüzeyini UV ışınlarından korur'),
      spec('GRAMAJ', '500 ml'),
      spec('KOLİ', '12 Adet / 24 Adet'),
      spec('PALET', '70 Koli'),
    ],
  },
  {
    slug: 'dashboard-polish-spray',
    title: L('Torpido Parlatıcı Sprey', 'Dashboard Polish Spray', 'بخاخ تلميع لوحة القيادة'),
    shortDescription: L(
      'Araç konsolu ve iç aksamındaki plastik ve deri yüzeyleri temizler; uzun süre parlaklık ve hoş koku bırakır.',
      'Cleans plastic and leather surfaces on the console and interior; lasting shine and pleasant scent.',
      'ينظف الأسطح البلاستيكية والجلدية في الكونسول والمقصورة؛ لمعان دائم ورائحة لطيفة.',
    ),
    body: L(
      'TORPİDO PARLATICI SPREY; Aracın konsol ve diğer iç aksamında yer alan plastik, deri yüzeylerin etkin bir şekilde temizlenmesini sağlar. Düzenli kullanıldığında yüzeylerin ömrünü uzatır. Araç içinde uzun süre dayanıklı hoş bir koku bırakan farklı esansları vardır. Ozon tabakasına zarar verici itici gazlar içermez. Parlaklığını uzun süre korur. Leke yapmaz.',
      'DASHBOARD POLISH SPRAY; Ensures effective cleaning of plastic and leather surfaces on the console and other interior parts. Regular use extends surface life. Contains essences that leave a long-lasting pleasant smell. Does not contain ozone-damaging propellants. Maintains shine for a long time. Does not stain.',
      'بخاخ تلميع لوحة القيادة؛ ينظف بفعالية الأسطح البلاستيكية والجلدية في الكونسول وأجزاء المقصورة. الاستخدام المنتظم يطيل عمر الأسطح. يحتوي على خلاصات تترك رائحة لطيفة تدوم طويلاً. لا يحتوي على غازات دافعة تضر طبقة الأوزون. يحافظ على لمعانه طويلاً ولا يترك بقعاً.',
    ),
    benefits: [
      {title: L('Kurumaya karşı koruma', 'Protection from drying', 'حماية من الجفاف'), description: L('Yüzeyde koruyucu tabaka oluşturur.', 'Leaves a protective layer on the surface.', 'يشكّل طبقة واقية على السطح.')},
      {title: L('Antistatik toz koruma', 'Antistatic dust protection', 'حماية مضادة للكهرباء الساكنة'), description: L('Toz tutmayı azaltmaya yardımcı olur.', 'Helps reduce dust adhesion.', 'يساعد على تقليل التصاق الغبار.')},
      {title: L('UV koruma', 'UV protection', 'حماية من الأشعة فوق البنفسجية'), description: L('İç yüzeyleri destekleyici koruma sağlar.', 'Provides supportive protection for interior surfaces.', 'يوفر حماية داعمة لأسطح المقصورة.')},
    ],
    features: [
      {title: L('Leke yapmaz', 'Does not stain', 'لا يترك بقعاً'), description: L('Uygulama sonrası leke bırakmaz.', 'Does not leave stains after application.', 'لا يترك بقعاً بعد التطبيق.')},
      {title: L('Ozon dostu', 'Ozone-friendly', 'صديق للأوزون'), description: L('Ozon tabakasına zarar veren itici gaz içermez.', 'Contains no ozone-damaging propellants.', 'لا يحتوي على غازات دافعة تضر الأوزون.')},
    ],
    packaging: [pack('500 ml')],
    specs: [
      spec('RENK', 'Şeffaf'),
      spec('KOKU', 'Karakteristik'),
      spec('YOĞUNLUK', '0,98 g/cm³'),
      spec('VİZKOZİTE', '- 20 cP (at 25°C)'),
      spec('ALEVLENME NOKTASI', '> 60°C'),
      spec('BUHARLAŞMA ORANI', 'Orta ila hızlı (ortam sıcaklığına bağlı olarak)'),
      spec('DONMA NOKTASI', '-10°C ile -20°C arasında'),
      spec('KORUMA ÖZELLİĞİ', 'Yüzeyde koruyucu bir tabaka bırakır'),
      spec('GRAMAJ', '500 ml'),
      spec('KOLİ', '12 Adet / 24 Adet'),
      spec('PALET', '70 Koli'),
    ],
  },
  {
    slug: 'mdf-kit-activator',
    title: L('MDF Kit Aktivatör', 'MDF Kit Activator', 'منشّط طقم MDF'),
    shortDescription: L(
      'Ahşap, MDF, kauçuk, deri ve plastik yüzeylerde hızlı kürleşme için yüksek yapışma güçlü aktivatör seti.',
      'High-adhesion activator kit for fast curing on wood, MDF, rubber, leather and plastic surfaces.',
      'طقم منشّط بقوة التصاق عالية للتصلب السريع على الخشب وMDF والمطاط والجلد والبلاستيك.',
    ),
    body: L(
      'MDF KİT AKTİVATÖR; Ahşap parçaların montaj ve tamiratında. MDF, kauçuk, deri ve plastik yüzeylerde. Özellikle hızlı kürleşme istenen uygulamalarda tercih edilir. Yüksek yapıştırma gücü. Dikey yüzeylerde kullanıma uygundur, akma ve sıçrama yapmaz. Yüksek viskoziteli olduğu için özellikle gözenekli ve yapıştırılması zor yüzeylerde yapışma gücünün artmasını sağlar.\n\nUygulama Sonrası: Uygulandığı yüzeyde daha hızlı kuruma süresi ve yapışma gücünün artmasını sağlar.',
      'MDF KIT ACTIVATOR; Used in the assembly and repair of wooden parts, MDF, rubber, leather and plastic surfaces. Especially preferred where fast curing is required. High adhesion strength. Suitable for vertical surfaces; does not run or splash. High viscosity increases adhesion especially on porous and difficult-to-bond surfaces.\n\nAfter application: Faster drying and increased adhesion strength on the applied surface.',
      'منشّط طقم MDF؛ يُستخدم في تجميع وإصلاح الأجزاء الخشبية وأسطح MDF والمطاط والجلد والبلاستيك. يُفضل حيث يلزم التصلب السريع. قوة التصاق عالية ومناسب للأسطح العمودية دون سيلان أو تناثر. اللزوجة العالية تزيد قوة الالتصاق خاصة على الأسطح المسامية وصعبة اللصق.\n\nبعد التطبيق: زمن جفاف أسرع وزيادة قوة الالتصاق على السطح المطبق.',
    ),
    benefits: [
      {title: L('İç ve dış ortama uygun', 'Suitable for indoor & outdoor', 'مناسب للداخل والخارج'), description: L('İç ve dış uygulamalarda kullanılabilir.', 'Can be used indoors and outdoors.', 'يمكن استخدامه داخلياً وخارجياً.')},
      {title: L('Yapışmayı artırıcı', 'Enhances adhesion', 'يزيد الالتصاق'), description: L('Yapışma gücünü artırır.', 'Increases adhesion strength.', 'يزيد قوة الالتصاق.')},
      {title: L('Dikey uygulanabilir', 'Suitable for vertical apply', 'مناسب للتطبيق العمودي'), description: L('Dikey yüzeylerde akma yapmaz.', 'Does not run on vertical surfaces.', 'لا يسيل على الأسطح العمودية.')},
    ],
    features: [
      {title: L('Hızlı kürleşme', 'Fast curing', 'تصلب سريع'), description: L('Hızlı kürleşme istenen uygulamalar için uygundur.', 'Suitable where fast curing is required.', 'مناسب للتطبيقات التي تتطلب تصلباً سريعاً.')},
      {title: L('Yüksek viskozite', 'High viscosity', 'لزوجة عالية'), description: L('Gözenekli yüzeylerde yapışmayı destekler.', 'Supports bonding on porous surfaces.', 'يدعم الالتصاق على الأسطح المسامية.')},
    ],
    packaging: [
      pack('400gr + 80gr', 'Büyük set (400gr + 80gr)', 'Large set (400g + 80g)', 'الطقم الكبير (400 غ + 80 غ)'),
      pack('200gr + 40gr', 'Küçük set (200gr + 40gr)', 'Small set (200g + 40g)', 'الطقم الصغير (200 غ + 40 غ)'),
    ],
    specs: [
      spec('RENK', 'Şeffaf'),
      spec('KOKU', 'Karakteristik'),
      spec('YOĞUNLUK', '1,3 g/cm³'),
      spec('VİSKOSİTE', '1500-5000 cP (25 °C)'),
      spec('PH DEĞERİ', '8'),
      spec('KURUMA SÜRESİ', 'Genellikle 30 dk.-1 sa. aralığında'),
      spec('PARLAMA NOKTASI', '60 °C'),
      spec('DONMA NOKTASI', '-5°C ile -15°C arasında'),
      spec('GRAMAJ', '400gr+80gr / 200gr+40gr'),
      spec('KOLİ', '25 Adet'),
      spec('PALET', '70 Koli / 96 Koli'),
    ],
  },
  {
    slug: 'high-temperature-rtv-silicone',
    title: L('RTV Yüksek Isı Silikonu', 'Gasket Sealant / High Temperature RTV Silicone', 'سيليكون عالي الحرارة RTV'),
    shortDescription: L(
      'Asetoksi esaslı, 300 °C’ye kadar dayanıklı %100 silikon; fırın kapıları, ısıtma sistemleri ve motor kapakları için.',
      'Acetoxy-based 100% silicone resistant up to 300 °C; for oven doors, heating systems and engine covers.',
      'سيليكون 100% بأساس أسيتوكسي مقاوم حتى 300 °م؛ لأبواب الأفران وأنظمة التدفئة وأغطية المحرك.',
    ),
    body: L(
      'RTV YÜKSEK ISI SİLİKONU; Asetoksi esaslı havadaki nem ile kürlenen 300 °C’ye kadar dayanıklı fırın kapıları, ısıtma sistemleri, motor kapakları, makine contalama uygulamaları ve yüksek sıcaklık dayanımı gerektiren yerlerde sızdırmazlık uygulamalarında kullanılır. Yapışma gücü yüksek ve solvent içermeyen %100 silikondur.',
      'GASKET SEALANT; Acetoxy base, moisture curing, temperature resistance up to 300 °C. Suitable for oven doors, hotplates, heating systems and joints where high temperature resistance is necessary. High adhesion. Solvent-free. 100% silicone.',
      'سيليكون عالي الحرارة RTV؛ بأساس أسيتوكسي يتصلب برطوبة الهواء ومقاوم حتى 300 °م. يُستخدم في أبواب الأفران وأنظمة التدفئة وأغطية المحرك وحشوات الآلات وتطبيقات السدم التي تتطلب مقاومة حرارية عالية. التصاق عالٍ وخالٍ من المذيبات وسيليكون 100%.',
    ),
    benefits: [
      {title: L('Yüksek sıcaklık dayanıklılığı', 'High temperature resistance', 'مقاومة عالية للحرارة'), description: L('300 °C’ye kadar dayanıklıdır.', 'Resistant up to 300 °C.', 'مقاوم حتى 300 °م.')},
      {title: L('Yüksek yapışma gücü', 'High adhesive strength', 'قوة التصاق عالية'), description: L('Yüksek yapışma sağlar.', 'Provides high adhesion.', 'يوفر التصاقاً عالياً.')},
      {title: L('Solvent içermez', 'Solvent-free', 'خالٍ من المذيبات'), description: L('%100 silikon, solvent içermez.', '100% silicone, solvent-free.', 'سيليكون 100%، خالٍ من المذيبات.')},
    ],
    features: [
      {title: L('Nem ile kürlenme', 'Moisture curing', 'تصلب بالرطوبة'), description: L('Havadaki nem ile kürlenir.', 'Cures with atmospheric moisture.', 'يتصلب برطوبة الهواء.')},
      {title: L('Contalama uygulamaları', 'Gasket applications', 'تطبيقات الحشوات'), description: L('Makine contalama ve sızdırmazlık için uygundur.', 'Suitable for machine gasketing and sealing.', 'مناسب لحشوات الآلات والسدم.')},
    ],
    packaging: [pack('310 ml')],
    specs: [
      spec('KİMYASAL BAZ', 'Asetoksi'),
      spec('RENK', 'Siyah / Kırmızı'),
      spec('YOĞUNLUK', '0,98 (+/-0,03)'),
      spec('KATILAŞMA SÜRESİ', '3mm/24 hours (23 °C and 50% R.H)'),
      spec('KURUMA SÜRESİ', '10-20 min. (23 °C and 50% R.H)'),
      spec('GRAMAJ', '310 ml'),
      spec('KOLİ', '24 Adet'),
      spec('PALET', '80 Koli'),
    ],
  },
  {
    slug: 'aquarium-silicone',
    title: L('Akvaryum Silikonu', 'Aquarium Silicone', 'سيليكون حوض الأسماك'),
    shortDescription: L(
      'Balıklara zarar vermeyen, solvent içermeyen %100 silikon; akvaryum imalatı ve cam yapıştırma için.',
      '100% silicone that does not harm fish; solvent-free for aquarium manufacturing and glass bonding.',
      'سيليكون 100% لا يضر الأسماك؛ خالٍ من المذيبات لتصنيع الأحواض ولصق الزجاج.',
    ),
    body: L(
      'AKVARYUM SİLİKONU; Akvaryum imalatında ve cam yapıştırma işlerinde kullanılan, balıklara ve akvaryumda yaşayan canlılara zarar verebilecek kimyasallar içermeyen %100 silikondur. %100 Silikon, solvent içermez. Balıklara ve diğer canlılara zarar vermez. Çatlamaz, çekme yapmaz ve rengi bozulmaz.',
      'AQUARIUM SILICONE; 100% silicone used in aquarium manufacturing and glass bonding; does not contain chemicals that may harm fish and aquarium living creatures. Solvent-free. Does not crack, shrink or lose color.',
      'سيليكون حوض الأسماك؛ سيليكون 100% لتصنيع الأحواض ولصق الزجاج، خالٍ من المواد التي قد تضر الأسماك والكائنات الحية. خالٍ من المذيبات. لا يتشقق ولا ينكمش ولا يتغير لونه.',
    ),
    benefits: [
      {title: L('Solvent içermez', 'Solvent-free', 'خالٍ من المذيبات'), description: L('%100 silikon, solvent içermez.', '100% silicone, solvent-free.', 'سيليكون 100%، خالٍ من المذيبات.')},
      {title: L('Çatlama yapmaz', 'It will not crack', 'لا يتشقق'), description: L('Çatlamaz, çekme yapmaz.', 'Does not crack or shrink.', 'لا يتشقق ولا ينكمش.')},
      {title: L('Balıklara zarar vermez', 'It does not harm fish', 'لا يضر الأسماك'), description: L('Canlılara zarar verebilecek kimyasallar içermez.', 'Free of chemicals that may harm living creatures.', 'خالٍ من المواد التي قد تضر الكائنات الحية.')},
    ],
    features: [
      {title: L('Cam yapıştırma', 'Glass bonding', 'لصق الزجاج'), description: L('Cam yapıştırma işlerinde kullanılır.', 'Used for glass bonding.', 'يُستخدم في لصق الزجاج.')},
      {title: L('Renk bozulmaz', 'Color stable', 'ثابت اللون'), description: L('Rengi bozulmaz.', 'Does not lose color.', 'لا يتغير لونه.')},
    ],
    packaging: [pack('310 ml')],
    specs: [
      spec('KİMYASAL BAZ', 'Asetoksi'),
      spec('RENK', 'Siyah / Kırmızı'),
      spec('YOĞUNLUK', '1,1 (+/-0,03)'),
      spec('KATILAŞMA SÜRESİ', '2mm/24 hours (23 °C and 50% R.H)'),
      spec('KURUMA SÜRESİ', '10-20 min. (23 °C and 50% R.H)'),
      spec('GRAMAJ', '310 ml'),
      spec('KOLİ', '24 Adet'),
      spec('PALET', '80 Koli'),
    ],
  },
  {
    slug: 'shower-enclosure-silicone',
    title: L('Duşakabin Silikonu', 'Shower Cabin Silicone', 'سيليكون كابينة الاستحمام'),
    shortDescription: L(
      'Duşakabin ve küvet derzlerinde su sızıntısını engelleyen, küfe dayanıklı özel silikon.',
      'Specialty silicone for shower cabin and bathtub joints; waterproof and mold-resistant.',
      'سيليكون خاص لفواصل كابينة الاستحمام وأحواض الاستحمام؛ مقاوم للماء والعفن.',
    ),
    body: L(
      'DUŞAKABİN SİLİKONU; Duşakabinlerin ve küvetlerin etrafındaki derzleri doldurmak ve su sızıntısını engellemek için kullanılan özel bir silikondur. Bu silikon, suya ve küf oluşumuna dayanıklı üstün formüle sahiptir, böylece duş alanınızı uzun süre temiz ve hijyenik tutar.',
      'SHOWER CABIN SILICONE; Special silicone used to fill joints around shower cabins and bathtubs and prevent water leakage. Superior formula resistant to water and mold growth, keeping the shower area clean and hygienic for a long time.',
      'سيليكون كابينة الاستحمام؛ سيليكون خاص لملء الفواصل حول كبائن الدش وأحواض الاستحمام ومنع تسرب الماء. تركيبة متفوقة مقاومة للماء والعفن تحافظ على منطقة الدش نظيفة وصحية لفترة طويلة.',
    ),
    benefits: [
      {title: L('Su geçirmez', 'Waterproof', 'مقاوم للماء'), description: L('Su sızıntısını engeller.', 'Prevents water leakage.', 'يمنع تسرب الماء.')},
      {title: L('Sızıntı önleyici', 'Leakproof sealant', 'مانع للتسرب'), description: L('Derzlerde sızdırmazlık sağlar.', 'Provides joint sealing.', 'يوفر إحكاماً في الفواصل.')},
      {title: L('Küf karşısında dayanıklı', 'Resistant to mold', 'مقاوم للعفن'), description: L('Küf oluşumuna dayanıklıdır.', 'Resistant to mold growth.', 'مقاوم لنمو العفن.')},
    ],
    features: [
      {title: L('Duşakabin ve küvet', 'Shower & bathtub', 'دش وحوض استحمام'), description: L('Duşakabin ve küvet çevresi için uygundur.', 'Suitable around shower cabins and bathtubs.', 'مناسب حول كبائن الدش وأحواض الاستحمام.')},
    ],
    packaging: [pack('310 ml')],
    specs: [
      spec('KİMYASAL BAZ', 'Asetoksi veya Nötr'),
      spec('RENK', 'Şeffaf'),
      spec('YOĞUNLUK', '1,01 (+/-0,03)'),
      spec('KATILAŞMA SÜRESİ', '2 mm/24 hours (23 °C and 50% R.H)'),
      spec('KURUMA SÜRESİ', '10-20 min. (23 °C and 50% R.H)'),
      spec('GRAMAJ', '310 ml'),
      spec('KOLİ', '24 Adet'),
      spec('PALET', '100 Koli'),
    ],
  },
  {
    slug: 'mirror-silicone',
    title: L('Ayna Silikonu', 'Mirror Silicone', 'سيليكون المرايا'),
    shortDescription: L(
      'Nötr esaslı, aynalarda kararma yapmayan, kokusuz ve solvent içermeyen yüksek kaliteli yapıştırma silikonu.',
      'Neutral-based high-quality adhesive silicone; does not tarnish mirrors, odorless and solvent-free.',
      'سيليكون لصق عالي الجودة بأساس محايد؛ لا يسبب اسوداد المرايا، عديم الرائحة وخالٍ من المذيبات.',
    ),
    body: L(
      'AYNA SİLİKONU; Nötr esaslı, ayna yapıştırmak için kullanılan yüksek kaliteli yapıştırma silikonudur. Aynalarda kararmaya neden olmaz. Kokusuzdur. Korozyona neden olmaz. Solvent içermez. %100 silikondur. Aynaları; fayans, çelik, alüminyum, ahşap, alçıpan ve beton gibi yüzeylere yapıştırmak için uygundur.',
      'MIRROR SILICONE; Neutral-based high-quality silicone for bonding mirrors. Does not cause darkening on mirrors. Odorless. Non-corrosive. Solvent-free. 100% silicone. Suitable for bonding mirrors to tile, steel, aluminum, wood, plasterboard and concrete.',
      'سيليكون المرايا؛ سيليكون لصق عالي الجودة بأساس محايد للصق المرايا. لا يسبب اسوداداً، عديم الرائحة، غير مسبب للتآكل، خالٍ من المذيبات وسيليكون 100%. مناسب للصق المرايا على البلاط والفولاذ والألمنيوم والخشب والجبسوم بورد والخرسانة.',
    ),
    benefits: [
      {title: L('Solvent içermez', 'Solvent-free', 'خالٍ من المذيبات'), description: L('Solvent içermez, %100 silikondur.', 'Solvent-free, 100% silicone.', 'خالٍ من المذيبات، سيليكون 100%.')},
      {title: L('Kararma yapmaz', 'It does not tarnish', 'لا يسبب الاسوداد'), description: L('Aynalarda kararmaya neden olmaz.', 'Does not cause darkening on mirrors.', 'لا يسبب اسوداد المرايا.')},
      {title: L('Kokusuz', 'Odorless', 'عديم الرائحة'), description: L('Kokusuz formül.', 'Odorless formula.', 'تركيبة عديمة الرائحة.')},
    ],
    features: [
      {title: L('Nötr kürleme', 'Neutral curing', 'تصلب محايد'), description: L('Nötr esaslıdır.', 'Neutral-based.', 'بأساس محايد.')},
      {title: L('Çok yüzey uyumu', 'Multi-surface', 'متعدد الأسطح'), description: L('Fayans, çelik, alüminyum, ahşap, alçıpan ve betona uygundur.', 'Suitable for tile, steel, aluminum, wood, plasterboard and concrete.', 'مناسب للبلاط والفولاذ والألمنيوم والخشب والجبسوم بورد والخرسانة.')},
    ],
    packaging: [pack('310 ml')],
    specs: [
      spec('KİMYASAL BAZ', 'Nötr kürleme'),
      spec('RENK', 'Şeffaf'),
      spec('YOĞUNLUK', '1,01 (+/-0,03)'),
      spec('KATILAŞMA SÜRESİ', '2 mm/24 hours (23 °C and 50% R.H)'),
      spec('KURUMA SÜRESİ', '10-20 min. (23 °C and 50% R.H)'),
      spec('GRAMAJ', '310 ml'),
      spec('KOLİ', '24 Adet'),
      spec('PALET', '100 Koli'),
    ],
  },
  {
    slug: 'universal-silicone',
    title: L('Üniversal Silikon', 'Universal Silicone', 'سيليكون عام'),
    shortDescription: L(
      'Tek komponentli asetik kürleşmeli genel amaçlı silikon sızdırmazlık ve dolgu malzemesi.',
      'General-purpose single-component acetic-cure silicone sealant and filler.',
      'مانع تسرب وحشو سيليكون عام بمكون واحد وتصلب أسيتيك.',
    ),
    body: L(
      'ÜNİVERSAL SİLİKON; Genel amaçlı ve tek komponentli (asetik kürleşme), geniş kullanım alanına sahip silikon bazlı bir sızdırmazlık ve dolgu malzemesidir. Kürleştikten sonra sürekli elastik kalır. Gözeneksiz yüzeylere mükemmel yapışma sağlar. Çatlamaz, sararma yapmaz. Düşük ve yüksek sıcaklıklarda niteliklerini kaybetmez.',
      'UNIVERSAL SILICONE; General-purpose single-component (acetic curing) silicone-based sealant and filler with a wide range of applications. Remains permanently elastic after curing. Excellent adhesion to non-porous surfaces. Does not crack or yellow. Does not lose its properties at low and high temperatures.',
      'سيليكون عام؛ مادة سدم وحشو بأساس سيليكون بمكون واحد (تصلب أسيتيك) واسعة الاستخدام. تبقى مرنة دائماً بعد التصلب. التصاق ممتاز بالأسطح غير المسامية. لا تتشقق ولا تصفر. لا تفقد خصائصها في درجات الحرارة المنخفضة والعالية.',
    ),
    benefits: [
      {title: L('Elastik özellikli', 'Permanently elastic', 'مرونة دائمة'), description: L('Kürleştikten sonra sürekli elastik kalır.', 'Remains permanently elastic after curing.', 'تبقى مرنة دائماً بعد التصلب.')},
      {title: L('Çatlama yapmaz', 'It will not crack', 'لا يتشقق'), description: L('Çatlamaz, sararma yapmaz.', 'Does not crack or yellow.', 'لا يتشقق ولا يصفر.')},
      {title: L('Yüksek sıcaklığa dayanıklı', 'High temperature resistant', 'مقاوم لدرجات الحرارة العالية'), description: L('Düşük ve yüksek sıcaklıklarda niteliklerini korur.', 'Retains properties at low and high temperatures.', 'يحافظ على خصائصه في درجات الحرارة المنخفضة والعالية.')},
    ],
    features: [
      {title: L('Gözeneksiz yüzeylere yapışma', 'Adhesion to non-porous surfaces', 'التصاق بالأسطح غير المسامية'), description: L('Gözeneksiz yüzeylere mükemmel yapışma sağlar.', 'Provides excellent adhesion to non-porous surfaces.', 'يوفر التصاقاً ممتازاً بالأسطح غير المسامية.')},
    ],
    packaging: [pack('280 ml')],
    specs: [
      spec('KİMYASAL BAZ', 'Asetoksi'),
      spec('RENK', 'Beyaz / Şeffaf'),
      spec('YOĞUNLUK', '0,98 (+/-0,03)'),
      spec('KATILAŞMA SÜRESİ', '2 mm/24 hours (23 °C and 50% R.H)'),
      spec('KURUMA SÜRESİ', '10-20 min. (23 °C and 50% R.H)'),
      spec('GRAMAJ', '280 ml'),
      spec('KOLİ', '24 Adet'),
      spec('PALET', '100 Koli'),
    ],
  },
  {
    slug: 'e-universal-silicone',
    title: L('E-Üniversal Silikon', 'E-Universal Silicone', 'سيليكون E-Universal المحايد'),
    shortDescription: L(
      'Nötr kürlenen yüksek performanslı sızdırmazlık malzemesi; cephe, PVC, alüminyum ve cam uygulamaları için.',
      'Neutral-cure high-performance sealant for facade, PVC, aluminum and glass applications.',
      'مانع تسرب عالي الأداء بتصلب محايد لواجهات PVC والألمنيوم والزجاج.',
    ),
    body: L(
      'E-ÜNİVERSAL SİLİKON; Tek bileşenli nötr kürlenen yüksek performanslı sızdırmazlık ve dolgu malzemesidir. Güneş ışınlarına dayanıklı, yüksek yapışma gücüne sahip olduğundan alüminyum ve cam dış cephelerde kullanılır. Gözenekli ve gözeneksiz yüzeye astarsız mükemmel yapışma sağlar. Korozyona neden olmaz. Her türlü hava koşullarına son derece dayanıklıdır. Yüksek ve düşük sıcaklıklarda özelliklerini kaybetmez (-60 °C / +180 °C). Oldukça geniş uygulama sıcaklığına sahiptir. Solvent içermez. %100 silikondur. Kürlenirken çok az koku yayar. Duvar, tuğla, beton, PVC, alüminyum, ahşap, cam vb. pek çok malzemede dolgu ve sızdırmazlık uygulamalarında kullanılır.',
      'E-UNIVERSAL SILICONE; Neutral-cure high-performance silicone sealant for a wide range of building and construction joints. Excellent primerless adhesion to porous and non-porous substrates. Non-corrosive. Excellent weatherability in sunlight, rain, snow and ozone. Fast curing. Low modulus, high elasticity. 100% silicone. Very low odour. Suitable for weatherseal applications and expansion joints in precast concrete, wood, aluminum and PVC windows.',
      'سيليكون E-Universal؛ مانع تسرب وحشو عالي الأداء بمكون واحد وتصلب محايد. مقاوم لأشعة الشمس وذو التصاق عالٍ لواجهات الألمنيوم والزجاج. التصاق ممتاز دون أساس على الأسطح المسامية وغير المسامية. غير مسبب للتآكل ومقاوم جداً للعوامل الجوية. يحافظ على خصائصه من -60 °م إلى +180 °م. خالٍ من المذيبات وسيليكون 100% ورائحة ضعيفة عند التصلب. يُستخدم في الجدار والطوب والخرسانة وPVC والألمنيوم والخشب والزجاج وغيرها.',
    ),
    benefits: [
      {title: L('Solvent içermez', 'Solvent-free', 'خالٍ من المذيبات'), description: L('%100 silikon, solvent içermez.', '100% silicone, solvent-free.', 'سيليكون 100%، خالٍ من المذيبات.')},
      {title: L('Hava koşullarına dayanıklı', 'Weather resistant', 'مقاوم للعوامل الجوية'), description: L('Her türlü hava koşuluna son derece dayanıklıdır.', 'Extremely resistant to all weather conditions.', 'مقاوم جداً لجميع الظروف الجوية.')},
      {title: L('Güneş ışığına dayanıklı', 'UV protection', 'مقاوم لأشعة الشمس'), description: L('Güneş ışınlarına dayanıklıdır.', 'Resistant to sunlight.', 'مقاوم لأشعة الشمس.')},
    ],
    features: [
      {title: L('Astarsız yapışma', 'Primerless adhesion', 'التصاق دون أساس'), description: L('Gözenekli ve gözeneksiz yüzeylere astarsız yapışır.', 'Adheres to porous and non-porous surfaces without primer.', 'يلتصق بالأسطح المسامية وغير المسامية دون أساس.')},
      {title: L('Geniş sıcaklık aralığı', 'Wide temperature range', 'نطاق حرارة واسع'), description: L('-60 °C / +180 °C aralığında özelliklerini korur.', 'Retains properties from -60 °C to +180 °C.', 'يحافظ على خصائصه من -60 °م إلى +180 °م.')},
    ],
    packaging: [pack('280 ml')],
    specs: [
      spec('KİMYASAL BAZ', 'Nötr kürleme'),
      spec('RENK', 'Beyaz / Şeffaf'),
      spec('YOĞUNLUK', '1,15 (+/-0,03)'),
      spec('KATILAŞMA SÜRESİ', '2 mm/24 hours (23 °C and 50% R.H)'),
      spec('KURUMA SÜRESİ', '60-90 min. (23 °C and 50% R.H)'),
      spec('GRAMAJ', '280 ml'),
      spec('KOLİ', '24 Adet'),
      spec('PALET', '100 Koli'),
    ],
  },
  {
    slug: 'high-tack-adhesive',
    title: L('High Tack Silikon', 'High Tack Silicone', 'سيليكون High Tack'),
    shortDescription: L(
      'Tek komponentli AST polimer esaslı yüksek yapışma ve ilk tutunma güçlü yapıştırıcı; ağır malzemeleri sabitlemesiz yapıştırır.',
      'Single-component AST polymer adhesive with high adhesion and initial tack; bonds heavy materials without temporary fixing.',
      'لاصق بمكون واحد على أساس بوليمر AST بقدرة التصاق وتماسك أولي عاليين؛ يلصق المواد الثقيلة دون تثبيت مؤقت.',
    ),
    body: L(
      'HIGH TACK SİLİKON; High Tack, tek komponentli, yüksek yapışma ve ilk tutunma gücüne sahip, AST Polimer esaslı bir yapıştırıcıdır. Ağır yapı malzemelerinin sabitlenme ihtiyacı olmadan yapıştırılmasına olanak verir. Su geçirmezdir. Tek komponentlidir. Üzeri boyanabilir. Kabarcık oluşumu yoktur. Hacim kaybına uğramaz. Astar gerektirmez.',
      'HIGH TACK SILICONE; High Tack is a single-component AST polymer based adhesive with high adhesion and initial tack strength. Allows bonding of heavy building materials without the need for fixing. Waterproof. Paintable. No bubble formation. No volume loss. Does not require primer.',
      'سيليكون High Tack؛ لاصق بمكون واحد على أساس بوليمر AST بقدرة التصاق وتماسك أولي عاليين. يتيح لصق مواد البناء الثقيلة دون الحاجة إلى تثبيت. مقاوم للماء، قابل للطلاء، بلا فقاعات، بلا فقد حجم، ولا يتطلب أساساً.',
    ),
    benefits: [
      {title: L('Boyanabilir', 'Paintable', 'قابل للطلاء'), description: L('Üzeri boyanabilir.', 'Can be painted over.', 'يمكن طلاؤه.')},
      {title: L('Hacim kaybetmez', 'Does not lose volume', 'لا يفقد الحجم'), description: L('Hacim kaybına uğramaz.', 'Does not lose volume.', 'لا يفقد حجمه.')},
      {title: L('Astar gerektirmez', 'No primer required', 'لا يتطلب أساساً'), description: L('Astar gerektirmez.', 'Does not require primer.', 'لا يتطلب أساساً.')},
    ],
    features: [
      {title: L('Yüksek ilk tutunma', 'High initial tack', 'تماسك أولي عالٍ'), description: L('Ağır malzemeleri sabitlemesiz yapıştırır.', 'Bonds heavy materials without temporary fixing.', 'يلصق المواد الثقيلة دون تثبيت مؤقت.')},
      {title: L('Su geçirmez', 'Waterproof', 'مقاوم للماء'), description: L('Su geçirmezdir.', 'Waterproof.', 'مقاوم للماء.')},
    ],
    packaging: [pack('290 ml')],
    specs: [
      spec('KİMYASAL BAZ', 'Silan sonlandırılmış polimer'),
      spec('YOĞUNLUK', '1,60 (+/-0,04)'),
      spec('KATILAŞMA SÜRESİ', '3 mm/24 hours (23 °C and 50% R.H)'),
      spec('Shore A', '55'),
      spec('GRAMAJ', '290 ml'),
      spec('KOLİ', '24 Adet'),
      spec('PALET', '100 Koli'),
    ],
  },
  {
    slug: 'acrylic-sealant',
    title: L('Akrilik Mastik', 'Acrylic Mastic', 'ماستيك أكريليك'),
    shortDescription: L(
      'İç ve dış ortamlarda yapı malzemesi birleşimleri ve çatlaklar için tek komponentli genel amaçlı akrilik mastik.',
      'One-component general-purpose acrylic mastic for indoor/outdoor joints and cracks in building materials.',
      'ماستيك أكريليك عام بمكون واحد لمفاصل وشقوق مواد البناء داخلياً وخارجياً.',
    ),
    body: L(
      'AKRİLİK MASTİK; İç ve dış ortamlarda, yapı malzemelerinin birleşimlerinde ve çatlaklarda kullanılabilen, tek komponentli ve genel amaçlı bir akrilik mastiktir. Özellikle statik fugalarda (boşluklarda) kullanım için ideal, ekonomik bir derz dolgu mastiğidir. Üzeri boyanabilir. Tuğla, beton, ahşap vb. bütün gözenekli yüzeylerde kullanılabilir.',
      'ACRYLIC MASTIC; One-component general-purpose acrylic mastic for joints and cracks of building materials indoors and outdoors. Economical joint-filling mastic ideal especially for static joints (gaps). Overpaintable. Suitable for all porous surfaces such as brick, concrete and wood.',
      'ماستيك أكريليك؛ ماستيك أكريليك عام بمكون واحد للمفاصل والشقوق في مواد البناء داخلياً وخارجياً. حشو فواصل اقتصادي مثالي خاصة للفجوات الثابتة. قابل للطلاء. مناسب لجميع الأسطح المسامية مثل الطوب والخرسانة والخشب.',
    ),
    benefits: [
      {title: L('İç ve dış ortama uygun', 'Suitable for indoor & outdoor', 'مناسب للداخل والخارج'), description: L('İç ve dış uygulamalarda kullanılabilir.', 'Can be used indoors and outdoors.', 'يمكن استخدامه داخلياً وخارجياً.')},
      {title: L('Üzeri boyanabilir', 'Paintable', 'قابل للطلاء'), description: L('Üzeri boyanabilir.', 'Can be painted over.', 'يمكن طلاؤه.')},
      {title: L('Akrilik', 'Acrylic', 'أكريليك'), description: L('Akrilik dispersiyon bazlıdır.', 'Based on acrylic dispersion.', 'بأساس مبعثر أكريليك.')},
    ],
    features: [
      {title: L('Statik fuga dolgusu', 'Static joint filler', 'حشو فواصل ثابتة'), description: L('Statik fugalarda idealdir.', 'Ideal for static joints.', 'مثالي للفواصل الثابتة.')},
      {title: L('Gözenekli yüzeyler', 'Porous surfaces', 'أسطح مسامية'), description: L('Tuğla, beton, ahşap vb. gözenekli yüzeylerde kullanılır.', 'Used on porous surfaces such as brick, concrete and wood.', 'يُستخدم على الأسطح المسامية مثل الطوب والخرسانة والخشب.')},
    ],
    packaging: [pack('450 ml')],
    specs: [
      spec('KİMYASAL BAZ', 'Akrilik Dispersiyon'),
      spec('RENK', 'Beyaz / Antrasit / Altın meşe / Gri'),
      spec('YOĞUNLUK', '1,15 (+/-0,03)'),
      spec('KATILAŞMA SÜRESİ', '2 mm/24 hours (23 °C and 50% R.H)'),
      spec('KURUMA SÜRESİ', '15-45 min. (23 °C and 50% R.H)'),
      spec('GRAMAJ', '450 ml'),
      spec('KOLİ', '24 Adet'),
      spec('PALET', '100 Koli'),
    ],
  },
  {
    slug: 'siliconized-sealant',
    title: L('Silikonize Mastik', 'Siliconized Sealant', 'ماستيك سيليكوني'),
    shortDescription: L(
      'Tek bileşenli, çatlamaya karşı dirençli esnek silikonize mastik; PVC ve alüminyum doğramalar için.',
      'One-component flexible crack-resistant siliconized sealant for PVC and aluminum joinery.',
      'ماستيك سيليكوني مرن بمكون واحد ومقاوم للتشقق لنجارة PVC والألمنيوم.',
    ),
    body: L(
      'SİLİKONİZE MASTİK; Tek bileşenli yüksek kaliteli, çatlamaya karşı dirençli, esnek silikonize mastik. %12,5 derz hareket kabiliyeti vardır. PVC ve alüminyum doğramaların montajında kullanılır. PVC, alüminyum, ahşap, beton gibi yapı malzemelerine mükemmel yapışma sağlar.',
      'SILICONIZED SEALANT; One-component high-quality flexible joint sealant based on acrylic dispersions. Odorless and easy to use. Used for sealing PVC and aluminum windows. UV and water resistant. 12.5% joint movement capacity. Good adhesion to PVC, aluminum, wood, concrete and many construction materials.',
      'ماستيك سيليكوني؛ ماستيك سيليكوني مرن عالي الجودة بمكون واحد ومقاوم للتشقق. قدرة حركة فواصل 12.5%. يُستخدم في تركيب نجارة PVC والألمنيوم. التصاق ممتاز بـ PVC والألمنيوم والخشب والخرسانة ومواد البناء المماثلة.',
    ),
    benefits: [
      {title: L('UV ışınlarına dirençli', 'UV protection', 'مقاوم للأشعة فوق البنفسجية'), description: L('UV ışınlarına dirençlidir.', 'Resistant to UV rays.', 'مقاوم للأشعة فوق البنفسجية.')},
      {title: L('Çatlamaya karşı dirençli', 'Crack resistant', 'مقاوم للتشقق'), description: L('Çatlamaya karşı dirençlidir.', 'Resistant to cracking.', 'مقاوم للتشقق.')},
      {title: L('Kokusuz', 'Odorless', 'عديم الرائحة'), description: L('Kokusuzdur.', 'Odorless.', 'عديم الرائحة.')},
    ],
    features: [
      {title: L('%12,5 derz hareketi', '12.5% joint movement', 'حركة فواصل 12.5%'), description: L('%12,5 derz hareket kabiliyeti vardır.', 'Has 12.5% joint movement capacity.', 'لديه قدرة حركة فواصل 12.5%.')},
      {title: L('PVC ve alüminyum', 'PVC & aluminum', 'PVC والألمنيوم'), description: L('PVC ve alüminyum doğramaların montajında kullanılır.', 'Used for installing PVC and aluminum joinery.', 'يُستخدم في تركيب نجارة PVC والألمنيوم.')},
    ],
    packaging: [pack('500 ml')],
    specs: [
      spec('KİMYASAL BAZ', 'Akrilik Dispersiyon'),
      spec('RENK', 'Beyaz / Antrasit / Altın meşe / Gri'),
      spec('YOĞUNLUK', '1,65 (+/-0,03)'),
      spec('KATILAŞMA SÜRESİ', '2 mm/24 hours (23 °C and 50% R.H)'),
      spec('KURUMA SÜRESİ', '15-45 min. (23 °C and 50% R.H)'),
      spec('GRAMAJ', '500 ml'),
      spec('KOLİ', '24 Adet'),
      spec('PALET', '100 Koli'),
    ],
  },
  {
    slug: 'grout-filler',
    title: L('Derz Dolgu', 'Joint Filling', 'حشو الفواصل'),
    shortDescription: L(
      'Tek bileşenli akrilik esaslı kullanıma hazır derz dolgu; küf ve mantara dirençli, iç ve dış mekâna uygun.',
      'One-component acrylic ready-to-use joint filler; resistant to mold and mildew, suitable indoors and outdoors.',
      'حشو فواصل أكريليك جاهز للاستخدام بمكون واحد؛ مقاوم للعفن والفطريات ومناسب للداخل والخارج.',
    ),
    body: L(
      'DERZ DOLGU; Tek bileşenli, akrilik esaslı kullanıma hazır derz dolgudur. Küf ve mantar oluşumuna dirençli, çatlama ve çökme yapmaz. Kuruduktan sonra suya karşı dayanıklıdır. İç ve dış mekanlarda kullanıma uygundur.',
      'JOINT FILLING; One-component acrylic-based ready-to-use joint filler. Resistant to mold and fungus formation; does not crack or collapse. Water-resistant after drying. Suitable for indoor and outdoor use.',
      'حشو الفواصل؛ حشو فواصل أكريليك جاهز للاستخدام بمكون واحد. مقاوم لتكوّن العفن والفطريات؛ لا يتشقق ولا ينهار. مقاوم للماء بعد الجفاف. مناسب للاستخدام الداخلي والخارجي.',
    ),
    benefits: [
      {title: L('Çatlamaya karşı dirençli', 'Crack resistant', 'مقاوم للتشقق'), description: L('Çatlama ve çökme yapmaz.', 'Does not crack or collapse.', 'لا يتشقق ولا ينهار.')},
      {title: L('Küf ve mantara dirençli', 'Resistant to mold and mildew', 'مقاوم للعفن والفطريات'), description: L('Küf ve mantar oluşumuna dirençlidir.', 'Resistant to mold and fungus formation.', 'مقاوم لتكوّن العفن والفطريات.')},
      {title: L('Suya dayanıklı', 'Water resistant', 'مقاوم للماء'), description: L('Kuruduktan sonra suya karşı dayanıklıdır.', 'Water-resistant after drying.', 'مقاوم للماء بعد الجفاف.')},
    ],
    features: [
      {title: L('Kullanıma hazır', 'Ready to use', 'جاهز للاستخدام'), description: L('Tek bileşenli, kullanıma hazırdır.', 'One-component and ready to use.', 'بمكوّن واحد وجاهز للاستخدام.')},
      {title: L('İç ve dış mekân', 'Indoor & outdoor', 'داخلي وخارجي'), description: L('İç ve dış mekanlarda kullanıma uygundur.', 'Suitable for indoor and outdoor use.', 'مناسب للاستخدام الداخلي والخارجي.')},
    ],
    packaging: [pack('310 ml')],
    specs: [
      spec('KİMYASAL BAZ', 'Akrilik Dispersiyon'),
      spec('RENK', 'Beyaz'),
      spec('YOĞUNLUK', '1,67 (+/-0,03)'),
      spec('KATILAŞMA SÜRESİ', '2mm/24 hours (23 °C and 50% R.H)'),
      spec('KURUMA SÜRESİ', '15-45 min. (23 °C and 50% R.H)'),
      spec('GRAMAJ', '310 ml'),
      spec('KOLİ', '24 Adet'),
      spec('PALET', '120 Koli'),
    ],
  },
]
