# Polumat Kimya Web Sitesi Yenileme Planı

> Durum: Planlama  
> Son güncelleme: 2 Ağustos 2026  
> Hedef stack: Next.js 16 App Router + TypeScript + Tailwind CSS 4 + Sanity 5  
> Diller: Türkçe, İngilizce, Arapça  
> Varsayılan dil: Türkçe (`tr`)

## 1. Yönetici özeti

Polumat Kimya web sitesi; koyu, premium ve endüstriyel bir görsel kimlikle, ürün keşfini ve teklif toplamayı merkeze alan üç dilli bir kurumsal platform olarak yeniden geliştirilecektir.

Ana kararlar:

- Frontend güncel Next.js App Router önerileriyle geliştirilecektir.
- Sanity Studio, Next.js içine gömülü `/admin` rotası olmaktan çıkarılacak ve bağımsız bir uygulama haline getirilecektir.
- Site Türkçe, İngilizce ve Arapça çalışacaktır.
- Bütün public URL'ler locale prefix'i taşıyacaktır: `/tr`, `/en`, `/ar`.
- Varsayılan dil Türkçe olmasına rağmen Türkçe prefixsiz sunulmayacaktır. `/` adresi `/tr` adresine yönlenecektir.
- Locale sonrasındaki bütün sabit route segmentleri ve içerik slug'ları İngilizce olacaktır.
- Ürün gibi teknik ve ortak varlıklar field-level localization ile; ana sayfa, kurumsal sayfa ve blog gibi sunumsal içerikler document-level localization ile yönetilecektir.
- Arapça deneyim gerçek RTL desteğine sahip olacaktır.
- Metinler, medya, ürün verileri, navigasyon, footer, CTA'lar, bölüm sıraları ve SEO mümkün olduğunca Sanity tarafından yönetilecektir.
- Tasarım token'ları, CSS sınıfları, güvenlik, API anahtarları ve form iş mantığı kodda kalacaktır.
- Mevcut Türkçe URL'ler 301 yönlendirmeleriyle korunacaktır.

## 2. Mevcut durum

### 2.1 Kod tabanı

Mevcut projede:

- Next.js `16.2.12`
- React `19.2.4`
- TypeScript
- Tailwind CSS 4
- ESLint
- Sanity `5.x`
- `next-sanity 13.x`
- App Router

bulunmaktadır.

Mevcut frontend henüz başlangıç seviyesindedir. Sanity Studio, Next.js uygulamasına `/admin` altında gömülüdür ve şema listesi boştur. Proje yeni mimariye geçmek için uygun aşamadadır.

### 2.2 Mevcut canlı site içerik envanteri

İncelemede tespit edilen ana içerikler:

- 19 ürün
- 2 ürün kategorisi
  - Endüstriyel Spreyler
  - Yapı Kimyasalları
- 9 kurumsal veya yardımcı sayfa
- 4 blog yazısı
- Uygulama videosu
- PDF ürün kataloğu
- Ürün güvenlik bilgi formları
- İletişim formu
- Bayi girişi
- WhatsApp iletişim bağlantıları

### 2.3 Mevcut sitenin başlıca problemleri

- Ana sayfa, kategori ve ürün detaylarında aynı sayfa başlığı ve genel meta açıklaması kullanılmaktadır.
- Canonical URL bulunmamaktadır.
- Open Graph ve Twitter metadata eksiktir.
- JSON-LD yapılandırılmış verisi bulunmamaktadır.
- Ürün detaylarında ürün adı `h1` yerine daha düşük seviyeli başlıkla gösterilmektedir.
- Sitemap URL'leri eski `http://www` originini kullanmaktadır.
- Sitemap içindeki `lastmod` değerleri statik ve aynıdır.
- Uygulama videoları ve iade/değişim gibi bazı sayfalar sitemap'te bulunmamaktadır.
- `robots.txt`, sitemap adresini bildirmemektedir.
- İletişim e-postaları, telefonlar ve WhatsApp numaraları farklı alanlarda ayrı tutulduğu için tutarsızlık riski vardır.
- Google Translate widget gerçek localization yerine kullanılmakta ve arayüzü bozmaktadır.
- Ürün kataloğunda kategori ve uygulama alanına göre güçlü keşif akışı yoktur.
- Teknik tablolar mobil ekranlarda verimsizdir.
- Ana sayfa marka yetkinliği yerine dönemsel kampanyayı fazla öne çıkarmaktadır.
- Private label, uygulama alanları, kalite ve üretim kapasitesi yeterince görünür değildir.

## 3. Proje hedefleri

### 3.1 Birincil hedefler

- Polumat'ın profesyonel ve güvenilir üretici algısını güçlendirmek.
- Ürünlerin kategori ve kullanım alanı üzerinden kolay keşfedilmesini sağlamak.
- Teklif taleplerini artırmak.
- Private label hizmetini ayrı ve güçlü bir satış kanalı haline getirmek.
- Teknik ürün bilgilerini düzenli, okunabilir ve indirilebilir biçimde sunmak.
- İçerik ekibinin kod değişikliği olmadan siteyi yönetebilmesini sağlamak.
- Türkçe, İngilizce ve Arapça içerikleri kontrollü biçimde yayınlamak.
- SEO ve eski URL değerini korumak.
- Mobil, erişilebilir ve hızlı bir deneyim sağlamak.

### 3.2 Tasarım hedefleri

- Koyu ve endüstriyel bir görsel dil.
- Polumat kırmızısının kontrollü vurgu rengi olarak kullanılması.
- Büyük ve condensed başlıklar.
- Güçlü ürün packshot'ları.
- İnce kırmızı çerçeveler ve sınırlı glow efektleri.
- Hafif grid, hexagon veya teknik doku kullanımı.
- Masaüstünde yoğun ama düzenli; mobilde daha sade içerik akışı.
- Düşük hareketli, profesyonel animasyonlar.
- Referans tasarımın karakterini taşıyan, fakat piksel kopyası olmayan özgün arayüz.

### 3.3 Kapsam dışında tutulacaklar

- E-ticaret, sepet ve online ödeme
- Bayi portalının yeniden geliştirilmesi
- Üretim videosunun ham dosya olarak Sanity CDN'den yayınlanması
- Editörlerin serbest CSS, JavaScript veya Tailwind class girebilmesi
- Google Translate widget
- Eksik çeviriyi başka dilden sessizce gösteren yarım localization

## 4. Hedef kullanıcılar ve dönüşümler

### 4.1 Kullanıcı grupları

- Otomotiv bakım ve servis işletmeleri
- Endüstriyel bakım ekipleri
- Elektrik ve elektronik teknik servisleri
- Motosiklet ve bisiklet servisleri
- Tarım ve ağır ekipman işletmeleri
- Yapı kimyasalları bayileri
- Distribütörler
- Private label üretim hizmeti arayan markalar
- İhracat müşterileri

### 4.2 Birincil dönüşümler

- Teklif formu gönderme
- WhatsApp üzerinden iletişim
- Telefon veya e-posta bağlantısına tıklama
- Ürün kataloğu indirme
- SDS/TDS dokümanı indirme
- Ürün detayına geçiş
- Private label talebi gönderme

## 5. Dil ve URL stratejisi

### 5.1 Desteklenen locale'ler

| Dil | Tag | Varsayılan | Yön |
|---|---|---:|---|
| Türkçe | `tr` | Evet | `ltr` |
| İngilizce | `en` | Hayır | `ltr` |
| Arapça | `ar` | Hayır | `rtl` |

### 5.2 Zorunlu URL kuralları

- Her public sayfa locale prefix'i taşımalıdır.
- `/` adresi `/tr` adresine yönlenmelidir.
- Locale sonrasındaki route segmentleri İngilizce olmalıdır.
- Slug'lar yalnızca küçük ASCII harf, rakam ve tire içermelidir.
- Türkçe veya Arapça karakterli canonical slug kullanılmamalıdır.
- Ürün gibi structured content türlerinde aynı İngilizce slug üç dilde ortak kullanılmalıdır.
- Document-level içeriklerde her dil sürümü İngilizce karakterli ayrı slug taşıyabilir.
- Language switcher, document-level içeriklerin eşini translation metadata üzerinden bulmalıdır.

Örnek:

```text
/tr/products/brake-cleaner-spray
/en/products/brake-cleaner-spray
/ar/products/brake-cleaner-spray
```

Bu URL'lerde görünen sayfa başlıkları dile göre değişir:

```text
TR: Fren Balata Temizleme Spreyi
EN: Brake Cleaner Spray
AR: بخاخ منظف الفرامل
```

### 5.3 Locale yönlendirme davranışı

- `/` → `/tr`
- `/products` → `/tr/products`
- `/about` → `/tr/about`
- Desteklenmeyen `/de/...` gibi locale'ler 404 vermelidir.
- Kullanıcının elle seçtiği dil cookie ile hatırlanabilir.
- Otomatik `Accept-Language` algılaması Türkçe varsayılanı geçersiz kılmamalıdır.
- Arama motorları için her locale deterministik ve doğrudan erişilebilir olmalıdır.

## 6. Yeni site haritası

```text
/
└── redirect → /tr

/[locale]
├── /[locale]/products
│   ├── /[locale]/products/category/[categorySlug]
│   └── /[locale]/products/[productSlug]
├── /[locale]/industries
│   └── /[locale]/industries/[industrySlug]
├── /[locale]/private-label
├── /[locale]/about
├── /[locale]/quality-certificates
├── /[locale]/blog
│   └── /[locale]/blog/[postSlug]
├── /[locale]/videos
├── /[locale]/company/[pageSlug]
├── /[locale]/contact
├── /[locale]/request-a-quote
└── /[locale]/legal
    ├── /[locale]/legal/privacy-policy
    ├── /[locale]/legal/personal-data-protection
    └── /[locale]/legal/cookie-policy
```

Sistem rotaları:

```text
/sitemap.xml
/robots.txt
/api/draft-mode/enable
/api/draft-mode/disable
/api/contact
/api/quote
```

## 7. Eski URL yönlendirme planı

### 7.1 Kategori ve genel sayfalar

```text
/urunler
→ /tr/products

/urunler/kategori/endustriyel-spreyler
→ /tr/products/category/industrial-sprays

/urunler/kategori/yapi-kimyasallari
→ /tr/products/category/construction-chemicals

/sayfa/hakkimizda
→ /tr/about

/sayfa/misyon-ve-vizyonumuz
→ /tr/company/mission-and-vision

/sayfa/polumat-kalitesi
→ /tr/quality-certificates

/sayfa/cevreye-duyarlilik
→ /tr/company/environmental-responsibility

/sayfa/is-sagligi-ve-guvenligi
→ /tr/company/occupational-health-and-safety

/sayfa/musteri-memnuniyeti
→ /tr/company/customer-satisfaction

/sayfa/insan-kaynaklari
→ /tr/company/human-resources

/sayfa/uygulama-videolari
→ /tr/videos

/sayfa/iade-ve-degisim-politikamiz
→ /tr/company/return-and-exchange-policy

/iletisim
→ /tr/contact
```

### 7.2 Ürün slug eşlemeleri

| Eski slug | Yeni İngilizce slug |
|---|---|
| `fren-balata-temizleme-spreyi` | `brake-cleaner-spray` |
| `pas-sokucu-sprey` | `rust-remover-spray` |
| `motor-temizleme-spreyi` | `engine-cleaner-spray` |
| `sivi-gres-zincir-yaglayici` | `chain-lubricant-spray` |
| `kontak-temizleme-spreyi` | `contact-cleaner-spray` |
| `lastik-parlatici-sprey` | `tire-shine-spray` |
| `torpido-parlatici-sprey` | `dashboard-polish-spray` |
| `kalip-ayirici-sprey` | `mold-release-spray` |
| `silikonize-mastik` | `siliconized-sealant` |
| `akrilik-mastik` | `acrylic-sealant` |
| `rtv-yuksek-isi-silikonu` | `high-temperature-rtv-silicone` |
| `akvaryum-silikonu` | `aquarium-silicone` |
| `dusakabin-silikonu` | `shower-enclosure-silicone` |
| `ayna-silikonu` | `mirror-silicone` |
| `universal-silikon` | `universal-silicone` |
| `e-universal-silikon` | `e-universal-silicone` |
| `high-tack-silikon` | `high-tack-adhesive` |
| `mdf-kit-aktivator` | `mdf-kit-activator` |
| `derz-dolgusu` | `grout-filler` |

Bu İngilizce ürün terimleri üretim öncesinde resmi katalog ve teknik ekip tarafından doğrulanmalıdır.

Redirect eşlemeleri merkezi ve test edilebilir bir dosyada tutulmalıdır. Eski Türkçe ve yeni İngilizce slug'lar farklı olduğu için yalnızca wildcard redirect kullanılmamalıdır.

## 8. Sayfa planları

### 8.1 Header

- Açık veya koyu logo varyantı
- Ürünler
- Uygulama alanları
- Private Label
- Hakkımızda
- Kaynaklar veya blog
- İletişim
- Dil değiştirici
- Belirgin “Teklif Al” CTA'sı
- Mobil menü
- Sticky davranış
- Klavye ve ekran okuyucu uyumu

### 8.2 Ana sayfa

1. **Hero**
   - Üst etiket
   - Güçlü marka vaadi
   - Açıklama
   - “Ürünleri İncele” ve “Teklif Al” CTA'ları
   - Ürün ailesi görseli
   - Güven göstergeleri
2. **Öne çıkan ürünler**
   - Sanity'den manuel seçilen en fazla 6 ürün
   - Ürün görseli, kategori, kısa fayda ve detay CTA'sı
3. **Neden Polumat**
   - Kalite
   - Performans
   - Modern üretim
   - İhracat
   - Profesyonel kullanım
   - Private label
4. **Uygulama alanları**
   - Otomotiv
   - Endüstri
   - Bakım ve teknik servis
   - Elektrik ve elektronik
   - Motosiklet ve bisiklet
   - Tarım ve ağır ekipman
5. **Private label tanıtımı**
   - Hizmet avantajları
   - Süreç adımları
   - Teklif CTA'sı
6. **Hakkımızda**
   - Tesis görseli veya video
   - Kısa metin
   - İstatistikler
7. **Kalite ve belgeler**
   - Kalite süreçleri
   - ISO belgeleri
   - Menşei ve üretim göstergeleri
8. **Son içerikler**
   - İsteğe bağlı blog veya uygulama videoları
9. **Teklif CTA şeridi**
10. **Footer**

Ana sayfa bölümleri Sanity'den sıralanabilmeli ve açılıp kapatılabilmelidir. Editörlere serbest CSS veya layout kodu verilmemelidir.

### 8.3 Ürün listeleme

- Server-rendered ürün kartları
- Kategori filtresi
- Uygulama alanı filtresi
- Arama
- URL search params ile paylaşılabilir filtre durumu
- Sonuç sayısı
- Filtre temizleme
- Boş sonuç durumu
- Mobil filtre paneli
- Breadcrumb
- JavaScript olmadan temel ürün erişimi

### 8.4 Ürün detayı

- Tek ve anlamlı `h1`
- Ürün packshot'ı ve galeri
- Kısa ürün özeti
- Kategori ve uygulama alanları
- Faydalar
- Ürün özellikleri
- Kullanım alanları
- Uygulama talimatları
- Uyarılar
- Ambalaj seçenekleri
- Mobil uyumlu teknik özellik listeleri
- SDS, TDS ve katalog dosyaları
- Harici uygulama videosu
- WhatsApp ve teklif CTA'ları
- İlgili ürünler
- Breadcrumb
- Product JSON-LD

### 8.5 Uygulama alanı detayı

- Sektöre özel hero
- Problem ve ihtiyaç açıklaması
- Önerilen ürünler
- Öne çıkan faydalar
- Uygulama senaryoları
- İlgili video ve dokümanlar
- Teklif CTA'sı

### 8.6 Private label

- Hizmet vaadi
- Özel formül
- Ambalaj seçenekleri
- Etiket ve tasarım
- Dolum ve paketleme
- Lojistik destek
- Dört aşamalı üretim süreci
- Minimum sipariş ve süreçle ilgili kontrollü bilgiler
- Private label teklif formu

### 8.7 Hakkımızda ve kalite

- Şirket hikâyesi
- Tesis ve üretim kapasitesi
- İhracat bilgileri
- Kalite yaklaşımı
- Misyon ve vizyon
- Çevresel sorumluluk
- İş sağlığı ve güvenliği
- Sertifikalar ve indirilebilir belgeler

### 8.8 İletişim ve teklif

- Departman bazlı telefon ve e-posta
- Adres
- Harita
- Çalışma saatleri
- İletişim formu
- Teklif formu
- WhatsApp CTA'sı
- KVKK/onay alanı
- Dil bazlı başarı ve hata mesajları

## 9. Teknik mimari

### 9.1 Önerilen repo yapısı

```text
/
├── web/                 # Next.js frontend
├── studio/              # Bağımsız Sanity Studio
├── docs/
├── package.json         # Workspace ve ortak scriptler
└── README.md
```

Mevcut deployment klasör taşımayı engelliyorsa frontend root'ta kalabilir; ancak Studio yine bağımsız olmalıdır. İstisna gerekçesi README'de belgelenmelidir.

### 9.2 Next.js ilkeleri

- App Router
- TypeScript strict
- Tailwind CSS 4
- ESLint
- Turbopack
- `@/*` import alias
- Server Components varsayılan
- Client Components yalnızca etkileşim gereken dar alanlarda
- `next/image`
- `next/font`
- Metadata API
- `notFound()` ve route-level error handling
- Güncel Next.js 16 yerel dokümanına göre `proxy.ts`
- `middleware.ts` veya eski API davranışlarının varsayılmaması

### 9.3 Önerilen frontend klasörleri

```text
web/src/
├── app/
│   ├── [locale]/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── products/
│   │   ├── industries/
│   │   ├── private-label/
│   │   ├── about/
│   │   ├── blog/
│   │   ├── videos/
│   │   ├── company/
│   │   ├── contact/
│   │   └── request-a-quote/
│   ├── api/
│   ├── sitemap.ts
│   ├── robots.ts
│   └── not-found.tsx
├── components/
│   ├── layout/
│   ├── navigation/
│   ├── sections/
│   ├── product/
│   ├── forms/
│   ├── content/
│   └── ui/
├── dictionaries/
├── lib/
├── sanity/
│   ├── client.ts
│   ├── live.ts
│   ├── queries/
│   ├── fragments/
│   ├── image.ts
│   ├── link-resolver.ts
│   └── types.ts
└── styles/
```

## 10. Sanity localization stratejisi

Localization editör deneyimine göre modellenmelidir. Frontend mimarisi içerik modelini gereksiz kopyaya zorlamamalıdır.

### 10.1 Field-level localization

Şu structured content türlerinde kullanılacaktır:

- `product`
- `productCategory`
- `applicationArea`
- `siteSettings` içindeki editoryal etiketler
- Sertifika açıklamaları
- Teknik özellik etiketleri

`sanity-plugin-internationalized-array` kullanılmalıdır. Localized object ile dil başına property üretmekten kaçınılmalıdır.

Ortak kalan ürün alanları:

- Slug
- SKU
- Görseller
- Galeri
- Kategori referansları
- Uygulama alanı referansları
- Teknik sayısal değerler
- Ambalaj değerleri
- Doküman referansları
- Sıralama
- Öne çıkan ürün durumu

Localized ürün alanları:

- Başlık
- Kısa açıklama
- Portable Text gövde
- Faydalar
- Özellik açıklamaları
- Kullanım talimatları
- Uyarılar
- Teknik özellik etiketleri
- SEO
- Alt metinler
- CTA etiketleri

### 10.2 Document-level localization

Şu presentation content türlerinde kullanılacaktır:

- `homePage`
- `privateLabelPage`
- `contactPage`
- `page`
- `post`

`@sanity/document-internationalization` kullanılmalı ve çeviriler `translation.metadata` dokümanları üzerinden bağlanmalıdır.

### 10.3 Localized singleton'lar

```text
homePage-tr
homePage-en
homePage-ar

privateLabelPage-tr
privateLabelPage-en
privateLabelPage-ar

contactPage-tr
contactPage-en
contactPage-ar
```

Sabit `_id` yalnızca localized singleton'larda kullanılmalıdır. Normal içerik dokümanlarının ID'lerini Sanity üretmelidir.

### 10.4 Locale dokümanı

`locale` alanları:

- `name`
- `tag`
- `default`
- `direction`
- `fallback`
- `enabled`

Birden fazla locale'in `default: true` olmasını engelleyen doğrulama bulunmalıdır.

### 10.5 Çeviri tamamlanma durumu

Localized içeriklerde:

```text
draft
inReview
complete
```

durumları kullanılabilir.

Production davranışı:

- Temel başlık, body veya SEO eksikse başka dilden sessiz fallback yapılmamalıdır.
- Eksik dil sürümü sitemap'e girmemelidir.
- Dil değiştiricide eksik sürüm pasif gösterilmelidir.
- Gerekirse ilgili locale route'u 404 vermelidir.

## 11. Sanity içerik modeli

### 11.1 `siteSettings` singleton

- Şirket adı
- Localized kısa tanım
- Açık/koyu logo
- Favicon
- Varsayılan OG görseli
- Canonical site URL
- Varsayılan localized SEO
- Localized header navigasyonu
- Localized footer kolonları
- Teklif CTA'sı
- Departman bazlı telefonlar
- Departman bazlı e-postalar
- WhatsApp numarası ve localized mesaj
- Adres ve harita URL'si
- Sosyal medya hesapları
- PDF kataloglar
- Çalışma saatleri
- Localized footer yasal metni
- Localized arayüz etiketleri

### 11.2 `product`

- `title` localized
- `slug` ortak İngilizce slug
- `sku`
- Yayın durumu
- Sıralama
- `shortDescription` localized
- Portable Text detay localized
- Birincil kategori referansı
- İkincil kategori/tag referansları
- Uygulama alanı referansları
- Kart görseli
- Ana packshot
- Galeri
- Localized alt metinler
- Badge localized
- Öne çıkan ürün durumu
- Faydalar localized
- Ürün özellikleri localized
- Kullanım alanları localized
- Uygulama talimatları localized
- Uyarılar localized
- Ambalaj varyantları
- Teknik özellik grupları
- İlgili ürünler
- Harici video
- SDS/TDS/katalog referansları
- Private label uygunluğu
- Ürüne özel CTA
- Localized SEO
- `legacyId`
- `legacyUrls[]`
- `previousSlugs[]`

Teknik özellik modeli:

```text
specificationGroups[]
├── localized title
└── items[]
    ├── localized label
    ├── value
    ├── unit
    └── localized note
```

### 11.3 `productCategory`

- Localized başlık
- Ortak İngilizce slug
- Localized özet ve detay
- Görsel
- İkon
- Kontrollü tema vurgusu
- Sıralama
- Localized SEO

### 11.4 `applicationArea`

- Localized başlık
- Ortak İngilizce slug
- Localized özet ve detay
- Kapak görseli
- İkon
- Localized faydalar
- Ürün referansları
- CTA
- Localized SEO

### 11.5 `homePage`

- `language`
- SEO
- Page Builder
- Translation status

Page Builder blokları:

- `heroSection`
- `productShowcaseSection`
- `featureGridSection`
- `applicationGridSection`
- `privateLabelSection`
- `imageTextSection`
- `statsSection`
- `certificateSection`
- `videoSection`
- `latestContentSection`
- `ctaSection`

### 11.6 `page`

- Language
- Başlık
- İngilizce karakterli slug
- Page Builder
- SEO
- Translation status
- Legacy URL'ler
- Previous slug'lar

### 11.7 `post`

- Language
- Başlık
- İngilizce karakterli slug
- Özet
- Kapak
- Portable Text body
- Yayın tarihi
- Kategori
- Yazar
- İlgili ürünler
- SEO
- Translation status

### 11.8 `video`

- Localized başlık ve açıklama
- Video sağlayıcısı
- Harici URL veya playback ID
- Kapak
- İlgili ürünler
- Yayın tarihi

Production video standart Sanity `file` alanından oynatılmamalıdır. YouTube, Vimeo, Mux veya uygun Sanity Media Library çözümü kullanılmalıdır.

### 11.9 `downloadableDocument`

- Başlık
- Belge türü: SDS, TDS, katalog, sertifika veya kullanım kılavuzu
- Dil referansı
- Dosya
- Sürüm
- Yayın tarihi
- Geçerlilik tarihi
- İlgili ürünler
- Eski kaynak URL'si

### 11.10 `certificate`

- Localized belge adı
- Belgeyi veren kurum
- Belge numarası
- Tarihler
- Logo veya görsel
- İndirilebilir dosya
- Sıralama

### 11.11 Ortak object türleri

- `seo`
- `internalOrExternalLink`
- `callToAction`
- `imageWithAlt`
- `localizedImageWithAlt`
- `statItem`
- `featureItem`
- `contactChannel`
- `socialLink`
- `specificationGroup`
- `documentReference`
- `pageBuilder`

## 12. Sanity şema kuralları

- Root type'larda `defineType` kullanılmalıdır.
- Alanlarda `defineField` kullanılmalıdır.
- Array üyelerinde `defineArrayMember` kullanılmalıdır.
- Doküman ve objelerde uygun `@sanity/icons` ikonları kullanılmalıdır.
- İkon import biçimi kurulu sürümün gerçek API'sinden doğrulanmalıdır.
- Her schema anlamlı `preview` tanımlamalıdır.
- Zorunlu alanlar ve uzunluklar validation ile sınırlandırılmalıdır.
- Slug'lar `^[a-z0-9]+(?:-[a-z0-9]+)*$` biçiminde doğrulanmalıdır.
- Slug'lar doküman türü içinde benzersiz olmalıdır.
- Şema alan adları sunuma değil içeriğin anlamına göre seçilmelidir.
- `redButton`, `bigText`, `threeColumnRow` gibi isimler kullanılmamalıdır.
- Dizilerde frontend key'i olarak index değil `_key` kullanılmalıdır.
- GROQ projection'larında array öğelerinin `_key` ve `_type` değerleri getirilmelidir.
- Production verisi taşıyan alan doğrudan silinmemelidir.
- Şema evrimi deprecate → migrate → remove sürecini izlemelidir.

## 13. Sanity tarafından yönetilecekler ve kodda kalacaklar

### 13.1 Sanity tarafından yönetilecekler

- Metinler
- Görseller ve alt metinleri
- Ürün bilgileri
- Teknik değerler
- Ambalaj verileri
- Dokümanlar
- CTA metinleri ve bağlantıları
- Bölüm sırası ve görünürlüğü
- Header ve footer
- İletişim bilgileri
- SEO
- Sosyal bağlantılar
- Sertifikalar
- Uygulama alanları
- Private label süreçleri
- Navigasyon etiketleri
- Form giriş metinleri ve başarı mesajları

### 13.2 Kodda kalacaklar

- Tasarım token'ları
- CSS sınıfları
- Breakpoint'ler
- Form validation iş mantığı
- API anahtarları
- Güvenlik ayarları
- Rate limiting
- Redirect altyapısı
- Component davranışları
- Erişilebilirlik kontratları
- Teknik hata mesajları sözlüğü

Sanity alanlarında serbest Tailwind class, raw CSS, script veya kontrolsüz HTML kabul edilmemelidir.

## 14. Sanity entegrasyonu

- Studio bağımsız çalışmalıdır.
- Presentation Tool yapılandırılmalıdır.
- Draft Mode enable/disable rotaları oluşturulmalıdır.
- Visual Editing overlay desteği eklenmelidir.
- Kurulu `next-sanity` sürümüne uygun `defineLive` ve `<SanityLive />` kurulmalıdır.
- Sorgular `defineQuery` ile yazılmalıdır.
- Sanity TypeGen kurulmalıdır.
- Üretilen tipler elle tekrar tanımlanmamalıdır.
- Sanity client ve token kullanan modüller server-only olmalıdır.
- Mantık kontrolünde kullanılan Stega string'leri `stegaClean` ile temizlenmelidir.
- Metadata, sitemap, JSON-LD ve static params sorgularında Stega kapatılmalıdır.
- Static params yalnızca published perspective kullanmalıdır.
- Eksik dokümanlarda `notFound()` kullanılmalıdır.

## 15. Dil sözlükleri ve language switcher

### 15.1 Kod sözlükleri

Davranışa bağlı sabit UI metinleri typed server-only dictionary içinde tutulmalıdır:

```text
web/src/dictionaries/tr.ts
web/src/dictionaries/en.ts
web/src/dictionaries/ar.ts
```

Örnekler:

- Menü erişilebilirlik etiketleri
- Pagination kontrolleri
- Form validation mesajları
- Genel hata mesajları
- Filtre erişilebilirlik metinleri

Her üç sözlük aynı TypeScript key sözleşmesine uymalıdır. Sözlükler server-side dinamik import edilmelidir.

### 15.2 Language switcher

Görünen etiketler:

```text
Türkçe
English
العربية
```

Kurallar:

- Yalnızca bayrak kullanılmamalıdır.
- Klavye ve ekran okuyucu desteği olmalıdır.
- Structured content'te locale prefix'i değiştirilerek aynı ortak slug'a gidilmelidir.
- Document-level content'te hedef translation metadata üzerinden çözülmelidir.
- Çeviri yayımlanmamışsa seçenek pasif gösterilmeli veya güvenli liste sayfasına yönlenmelidir.
- Kullanıcının seçimi cookie ile saklanabilir.

## 16. Arapça ve RTL

Locale `ar` olduğunda:

```html
<html lang="ar" dir="rtl">
```

Türkçe ve İngilizcede:

```html
<html lang="tr" dir="ltr">
<html lang="en" dir="ltr">
```

Kurallar:

- `margin-left/right` yerine `margin-inline` kullanılmalıdır.
- `padding-left/right` yerine `padding-inline` kullanılmalıdır.
- `left/right` yerine mümkünse `inset-inline` kullanılmalıdır.
- `text-align: start/end` tercih edilmelidir.
- Yalnızca yön anlamı taşıyan ok ve chevron ikonları RTL'de çevrilmelidir.
- Logo, ürün ambalajı, sertifika ve sosyal ikonlar mirror edilmemelidir.
- Arapça için `Noto Sans Arabic` gibi uygun bir `next/font` fontu kullanılmalıdır.
- Arapça satır yüksekliği ayrıca ayarlanmalıdır.
- Telefon, e-posta, SKU, URL ve ölçüler gerektiğinde `dir="ltr"` kullanmalıdır.

RTL test edilecek alanlar:

- Masaüstü navigasyon
- Mobil menü
- Breadcrumb
- Ürün filtreleri
- Ürün kartları
- Teknik özellikler
- Formlar
- Input ikonları
- Accordion
- Carousel
- Pagination
- CTA okları
- Footer kolonları

## 17. Ortak frontend bileşenleri

- `SiteHeader`
- `MobileNavigation`
- `LanguageSwitcher`
- `SiteFooter`
- `SectionHeading`
- `ButtonLink`
- `SanityImage`
- `PortableText`
- `Breadcrumbs`
- `ProductCard`
- `ProductGrid`
- `ProductFilters`
- `ApplicationCard`
- `FeatureGrid`
- `StatsGrid`
- `CertificateGrid`
- `DocumentDownloads`
- `ProductSpecifications`
- `VideoEmbed`
- `QuoteForm`
- `ContactForm`
- `PageBuilder`
- `JsonLd`

Server Components varsayılan olmalıdır. Mobil menü, filtre etkileşimi, form durumu ve gerçekten gerekliyse carousel gibi dar alanlar Client Component olmalıdır.

## 18. Görsel yönetimi

- Sanity image URL builder kullanılmalıdır.
- `next/image` kullanılmalıdır.
- `width`, `height` ve `sizes` doğru verilmelidir.
- Crop ve hotspot desteklenmelidir.
- İçerik görsellerinde alt metin zorunlu veya güçlü warning olmalıdır.
- Dekoratif görseller boş alt metin kullanmalıdır.
- Hero LCP görseli gerektiğinde preload edilmelidir.
- Her görsele `priority` verilmemelidir.
- Kart görselleri lazy load edilmelidir.
- Şeffaf ürün packshot'ları desteklenmelidir.
- Görsel URL'leri component içinde elle string birleştirilmemelidir.

## 19. SEO planı

### 19.1 Metadata

Her indekslenebilir dil sayfası için:

- Benzersiz title
- Localized meta description
- Self-referencing canonical
- Open Graph
- Twitter card
- Robots ayarı
- Dil bazlı OG görseli
- Hreflang alternates

üretilmelidir.

Örnek alternates:

```html
<link rel="alternate" hreflang="tr" href="https://polumatkimya.com/tr/products/brake-cleaner-spray">
<link rel="alternate" hreflang="en" href="https://polumatkimya.com/en/products/brake-cleaner-spray">
<link rel="alternate" hreflang="ar" href="https://polumatkimya.com/ar/products/brake-cleaner-spray">
<link rel="alternate" hreflang="x-default" href="https://polumatkimya.com/tr/products/brake-cleaner-spray">
```

### 19.2 JSON-LD

- Ana sayfa: `Organization`, `WebSite`
- Ürün: `Product`, `Brand`, `BreadcrumbList`
- Blog: `Article`
- Kurumsal sayfalar: `BreadcrumbList`
- İletişim: doğrulanabilir alanlarla `Organization` veya uygun tür

Her localized JSON-LD içinde uygun `inLanguage` kullanılmalıdır.

JSON-LD güvenli biçimde serialize edilmeli ve kullanıcı içeriğinden gelebilecek `<` karakterleri escape edilmelidir.

### 19.3 Sitemap

- Yalnızca canonical HTTPS URL'leri içermelidir.
- `/tr`, `/en`, `/ar` URL'lerini içermelidir.
- Prefixsiz URL içermemelidir.
- Eski Türkçe URL'leri içermemelidir.
- Draft veya eksik çeviri içermemelidir.
- Gerçek `_updatedAt` veya yayın tarihini kullanmalıdır.
- Locale alternates desteklemelidir.

### 19.4 Robots

- Sitemap adresini bildirmelidir.
- Studio ve draft/preview rotalarının indekslenmesini engellemelidir.
- Production ve preview ortamı davranışları ayrılmalıdır.

## 20. Formlar ve güvenlik

İletişim ve teklif formları:

- Server-side validation
- Zod veya eşdeğer şema
- Honeypot
- Rate limiting için genişletilebilir yapı
- Origin/CSRF değerlendirmesi
- Localized başarı ve hata durumları
- Accessible label ve error bağlantıları
- KVKK/onay alanı
- Environment variable tabanlı gizli anahtarlar
- Locale bilgisini içeren submission payload

Form gönderimleri varsayılan olarak Sanity'ye kaydedilmemelidir. E-posta veya CRM sağlayıcısı server-side servis katmanı arkasında soyutlanmalıdır.

Arapça formda:

- Genel düzen RTL olmalıdır.
- Telefon ve e-posta input'ları gerektiğinde LTR olmalıdır.
- Validation mesajları Arapça olmalıdır.
- Yasal onay metninin Arapça karşılığı bulunmalıdır.

## 21. Erişilebilirlik

- Her sayfada tek anlamlı `h1`
- Mantıklı heading sırası
- Skip link
- Klavye ile çalışan navigasyon ve filtreler
- Görünür focus state
- Doğru ARIA davranışı
- Yeterli kontrast
- Form hatalarında `aria-describedby`
- Yaklaşık 44px minimum dokunmatik hedef
- `prefers-reduced-motion`
- Dekoratif ikonlarda `aria-hidden`
- Icon-only butonlarda erişilebilir ad
- Language switcher'ın ekran okuyucu uyumu
- `lang` ve `dir` değerlerinin doğru olması

## 22. Performans

- Client JavaScript minimum tutulmalıdır.
- Ağır hero slider kullanılmamalıdır.
- Tek hero mesajı veya hafif kontrollü varyant tercih edilmelidir.
- Video iframe'i kullanıcı etkileşimine veya görünürlüğe kadar yüklenmemelidir.
- Font sayısı ve ağırlıkları sınırlandırılmalıdır.
- Doğru image `sizes` kullanılmalıdır.
- Ölçüsüz medya nedeniyle CLS oluşmamalıdır.
- Ana içerik client-side fetch'e bağımlı olmamalıdır.
- Üçüncü taraf scriptleri gerekmedikçe eklenmemelidir.
- Production build ile route ve bundle davranışı doğrulanmalıdır.
- Arabic font yalnızca gerekli locale'de yüklenmelidir.

## 23. İçerik aktarımı

Mevcut canlı site içeriği frontend koduna hardcode edilmemelidir. Tekrarlanabilir bir import/migration scripti hazırlanmalıdır.

Aktarılacaklar:

- 19 ürün
- 2 kategori
- Kurumsal sayfalar
- 4 blog yazısı
- Video bilgisi
- PDF katalog
- Ürün güvenlik ve teknik dokümanları
- Mevcut görseller
- Eski slug ve URL bilgileri
- İletişim bilgileri

Migration kuralları:

- Normal dokümanlarda deterministik `_id` kullanılmamalıdır.
- Eski kimlikler `legacyId` alanında tutulmalıdır.
- Eski URL'ler `legacyUrls` alanında tutulmalıdır.
- Önceki slug'lar `previousSlugs` alanında tutulmalıdır.
- Referanslar gerçek Sanity `_id` lookup veya create sonucu üzerinden kurulmalıdır.
- Script source-key alanı üzerinden idempotent çalışabilmelidir.
- Production dataset yazımı öncesinde dry-run olmalıdır.
- İngilizce ve Arapça çevirisi bulunmayan içeriklerin translation status'u `draft` olmalıdır.
- Eksik çeviri production sitemap'e girmemelidir.

## 24. Uygulama aşamaları

### Aşama 0 — İçerik ve karar hazırlığı

- Resmi İngilizce ürün isimlerini doğrula.
- Arapça teknik terminoloji için çeviri sorumlusu belirle.
- Private label içeriğini kesinleştir.
- Uygulama alanlarını kesinleştir.
- Form gönderim sağlayıcısını seç.
- Deployment ortamını belirle.

### Aşama 1 — Temel mimari

- Workspace yapısını kur.
- Next.js ve Studio'yu ayrıştır.
- Environment variable şablonlarını oluştur.
- Ortak lint, typecheck ve build scriptlerini kur.
- Locale routing ve root redirect altyapısını kur.

### Aşama 2 — Sanity

- Locale dokümanını oluştur.
- Localization pluginlerini kur.
- Şemaları ve ortak object'leri oluştur.
- Studio Structure kur.
- Localized singleton'ları oluştur.
- Validation ve preview'leri tamamla.
- TypeGen'i kur.

### Aşama 3 — Frontend temel sistemi

- Tasarım token'ları
- Fontlar
- LTR/RTL temeli
- Layout
- Header
- Footer
- Language switcher
- Ortak UI bileşenleri
- Sanity client, queries ve link resolver
- Visual Editing ve Draft Mode

### Aşama 4 — Ana sayfa ve pazarlama sayfaları

- Ana sayfa Page Builder renderer
- Private label
- Hakkımızda
- Kalite ve belgeler
- Uygulama alanları
- İletişim ve teklif

### Aşama 5 — Ürün sistemi

- Ürün listeleme
- Filtreler
- Ürün detayları
- Teknik özellikler
- Doküman indirmeleri
- İlgili ürünler
- Ürün JSON-LD

### Aşama 6 — Blog ve videolar

- Blog listeleme ve detay
- Translation metadata çözümleme
- Video listeleme
- Lazy video embed

### Aşama 7 — Migration

- Mevcut içerik extract
- Asset import
- Türkçe içerik import
- İngilizce ve Arapça translation taslakları
- Legacy URL ve redirect mapping
- İçerik QA

### Aşama 8 — SEO ve kalite

- Metadata
- Canonical
- Hreflang
- JSON-LD
- Sitemap
- Robots
- Redirect testleri
- Accessibility
- RTL QA
- Performance
- Production build

### Aşama 9 — Yayın

- İçerik editörü kabul testi
- Analytics ve Search Console doğrulaması
- Redirect doğrulaması
- Domain/canonical kontrolü
- Production dataset ve deploy
- Yayın sonrası 404 ve form takibi

## 25. Test planı

### 25.1 Otomatik kontroller

- ESLint
- TypeScript/typecheck
- Sanity schema extract
- Sanity TypeGen
- Production Next.js build
- Route smoke testleri
- Redirect testleri
- Link resolver testleri
- JSON-LD parse testi
- Sitemap URL testi
- Locale type guard testi
- Translation resolver testi

### 25.2 Görsel ve davranış kontrolleri

Ekran genişlikleri:

- 360px
- 768px
- 1024px
- 1440px

Örnek rotalar:

```text
/tr
/en
/ar

/tr/products/brake-cleaner-spray
/en/products/brake-cleaner-spray
/ar/products/brake-cleaner-spray
```

Kontroller:

- Doğru `html lang`
- Doğru `dir`
- Doğru localized içerik
- Doğru canonical
- Doğru hreflang
- Language switcher eşleşmesi
- Eksik translation davranışı
- RTL taşmaları
- Klavye navigasyonu
- Reduced motion
- Mobil menü
- Filtreler
- Form validation
- Kırık görsel
- Eksik alt metin
- Prefixsiz URL redirect
- Eski Türkçe URL redirect
- Desteklenmeyen locale için 404

## 26. Kabul kriterleri

- Bütün lint, typecheck ve production build kontrolleri geçmektedir.
- Studio bağımsız çalışmaktadır.
- `/` adresi `/tr` adresine yönlenmektedir.
- Türkçe, İngilizce ve Arapça rotalar çalışmaktadır.
- Arapça sayfalar gerçek RTL düzenine sahiptir.
- Bütün canonical public route segmentleri İngilizcedir.
- Editör ana sayfa bölümlerini sıralayabilmekte ve açıp kapatabilmektedir.
- Ürün, kategori, uygulama alanı, doküman, blog, header/footer ve SEO kod değişmeden yönetilebilmektedir.
- Ürün teknik verileri üç dilde ve mobilde okunabilmektedir.
- Eksik çeviri yanlış dil fallback'i üretmemektedir.
- Sitemap yalnızca yayımlanmış canonical HTTPS URL'lerini içermektedir.
- Hreflang ve `x-default` doğru üretilmektedir.
- Eski URL'ler 301 ile doğru Türkçe locale sayfasına gitmektedir.
- Sanity sorguları TypeGen ile tiplidir.
- Menü, language switcher, filtreler ve formlar klavye ile kullanılabilmektedir.
- Sanity'de serbest CSS, HTML veya script girişi bulunmamaktadır.
- Görsel düzen koyu, premium ve endüstriyel Polumat karakterini taşımaktadır.
- README; yerel kurulum, environment variables, Studio, TypeGen, localization, migration ve deployment adımlarını açıklamaktadır.

## 27. İçerik ekibinden gerekli materyaller

- Yüksek çözünürlüklü logo varyantları
- Ürün packshot'ları, tercihen şeffaf arka planlı
- Tesis fotoğrafları
- Resmi tanıtım videosu
- Güncel ürün kataloğu
- Her ürün için SDS/TDS
- ISO ve diğer sertifikalar
- Resmi Türkçe ürün metinleri
- Onaylı İngilizce ürün isimleri ve metinleri
- Onaylı Arapça teknik çeviriler
- Private label hizmet ayrıntıları
- Üretim kapasitesi ve ihracat istatistikleri
- Departman bazlı güncel iletişim bilgileri
- KVKK, gizlilik ve çerez metinleri

## 28. Cursor için uygulama promptu

Aşağıdaki prompt bu repository içinde Cursor'a verilebilir:

```text
Polumat Kimya web sitesi yenileme projesini üretime hazır biçimde uygula.

Önce şu dosyaları tamamen oku:

1. Repository kökündeki AGENTS.md
2. docs/polumat-website-renewal-plan.md
3. package.json
4. Kurulu Next.js sürümünün node_modules/next/dist/docs altındaki, yapacağın işle ilgili App Router dokümanları
5. Mevcut Sanity config, client, live ve Studio dosyaları

docs/polumat-website-renewal-plan.md bu projenin ürün, tasarım, URL, localization, Sanity, SEO, migration, erişilebilirlik ve kabul kriterleri için ana kaynak belgesidir. Belgede açıkça tanımlanan kararları gerekçesiz değiştirme.

Kritik kurallar:

- Site Türkçe, İngilizce ve Arapça çalışacak.
- Varsayılan dil Türkçe olacak ancak her locale URL prefix'i taşıyacak.
- `/` adresi `/tr` adresine yönlenecek.
- Locale sonrası bütün sabit route segmentleri İngilizce olacak.
- Ürün slug'ları üç dilde ortak İngilizce slug kullanacak.
- Arapça tam RTL desteğine sahip olacak.
- Ürün gibi structured content field-level localization kullanacak.
- Page, post ve localized singleton'lar document-level localization kullanacak.
- Sanity Studio bağımsız uygulama olacak.
- Server Components varsayılan olacak.
- Kurulu Next.js ve Sanity API'lerini dokümantasyondan doğrulamadan eski bilgiyle kod yazma.
- Kullanıcıya gösterilen editoryal içeriği frontend koduna hardcode etme.
- Editörlere serbest CSS, Tailwind class, script veya kontrolsüz HTML alanı açma.
- Normal Sanity dokümanlarında deterministik `_id` kullanma.
- Eski URL'leri 301 yönlendirmeleriyle koru.
- Eksik çeviriyi başka dilden sessizce gösterme.
- Metadata, sitemap, hreflang ve JSON-LD üç dil için eksiksiz olsun.

Çalışma sırası:

1. Repository incelemesi ve mevcut durum raporu
2. Uygulanacak mimari ve dosya planı
3. Workspace ve bağımsız Studio
4. Locale routing
5. Sanity şemaları ve localization
6. TypeGen, GROQ, Visual Editing ve Draft Mode
7. Tasarım sistemi, LTR/RTL ve ortak layout
8. Ana sayfa ve pazarlama sayfaları
9. Ürün kataloğu ve ürün detayları
10. Blog, videolar ve dokümanlar
11. Migration scripti ve redirect mapping
12. Metadata, hreflang, sitemap, robots ve JSON-LD
13. Form güvenliği
14. Test, build, accessibility, RTL ve responsive QA
15. README ve teslim raporu

İlk adımda kod değiştirme. Önce repository durumunu, tespit ettiğin riskleri, önerilen klasör yapısını ve uygulanacak aşamaları raporla. Ardından planla uyumlu olarak aşamalı biçimde implementasyona geç.

Her aşamada:

- Değişen dosyaları belirt.
- Lint/typecheck/build sonuçlarını raporla.
- Eksik içerik veya kullanıcı kararı gerekiyorsa açıkça ayır.
- İlgisiz kullanıcı değişikliklerine dokunma.
- Çalışmayan veya doğrulanmamış bir özelliği tamamlanmış gibi sunma.
```

## 29. Son karar özeti

Bu planın temel yaklaşımı, Polumat sitesini yalnızca görsel olarak yenilemek değil; üç dilde güvenli biçimde yayın yapabilen, ürün verisini tekrar etmeden yöneten ve gelecek içerik değişikliklerine dayanıklı bir platform oluşturmaktır.

Sanity editoryal kontrolü sağlar; Next.js ise routing, performans, erişilebilirlik, SEO ve güvenlik sınırlarını korur. Field-level ve document-level localization birlikte kullanılarak ürün verisinin üç kopyaya bölünmesi engellenirken, pazarlama sayfalarının her dilde bağımsız yayınlanmasına izin verilir.
