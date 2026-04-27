# Insightful — WhatsApp Mesaj Analiz Uygulaması

> Son güncelleme: Nisan 2026 · Platform: Web (React + Vite + Tailwind v4)

---

## 1. Vizyon

İnsanları daha iyi tanımanın en doğal yollarından biri mesajlaşma örüntülerini anlamaktır.  
Bu uygulama, WhatsApp'tan dışa aktarılan `.txt` dosyalarını okuyarak karşı taraf hakkında anlamlı, okunabilir bir analiz üretir.

**Ana felsefe:** Etiketlemek değil, örüntü göstermek.  
"Bu kişi narsist" demek yerine → "Bu kişi mesajlarında şu örüntüleri gösteriyor."

---

## 2. Mevcut Durum (Nisan 2026)

### ✅ Tamamlananlar

| Özellik | Durum | Notlar |
|---|---|---|
| **Parşömen Teması** | ✅ Bitti | Cinzel + EB Garamond, sepia/gold/parchment palette |
| **Karanlık Mod** | ✅ Bitti | Dark Academia estetiği, CSS vars ile otomatik renk değişimi |
| **WhatsApp Parser** | ✅ Bitti | iOS + Android format desteği (regex bazlı) |
| **Metrik Motoru** | ✅ Bitti | Yanıt süresi, kelime sayısı, emoji, aktif saatler, double texting |
| **Persona Algoritması** | ✅ Bitti | 5 karakter tipi × 2 cinsiyet = 10 karakter görseli otomatik eşleşme |
| **Insights View** | ✅ Bitti | Doğal dil yorumu, karşılaştırma kartları, saatlik aktivite grafiği |
| **Dashboard** | ✅ Bitti | Persona kartı, son analizler, mini istatistikler |
| **Dosya Yükleme** | ✅ Bitti | .txt dosya seçimi, self/partner modu, cinsiyet seçimi |
| **İşleme Ekranı** | ✅ Bitti | Progress animasyonu (dairesel SVG) |
| **Alt Navigasyon** | ✅ Bitti | Lucide ikonlar, spring animasyon, scroll'da gizlenme |
| **EN/TR Dil Desteği** | ✅ Bitti | locales.ts ile merkezi çeviri sistemi |
| **Mobil Uyumluluk** | ✅ Bitti | Responsive font boyutları, kompakt kartlar, mobile-first layout |
| **Fiyatlandırma Sayfası** | ✅ Bitti | Ücretsiz / Pro / Unlimited planlar |
| **Profil Sayfası** | ✅ Bitti | Dil değiştirme, dark mode toggle |

---

## 3. Eksikler ve Yapılacaklar

### 🔴 Kritik (MVP için şart)

| Eksik | Açıklama |
|---|---|
| **Gerçek AI yorumu yok** | Şu an `generateLocalSynthesis()` — hardcoded şablonlarla çalışıyor. Claude/OpenAI API bağlantısı yok. |
| **Login/Auth yok** | Google/Apple ile giriş sadece UI, arkasında gerçek auth yok |
| **Dosya parse hatası yönetimi** | Yanlış formatlı dosya yüklenince kullanıcıya net hata mesajı verilmiyor |
| **Demo data** | "Demo Analiz" butonu kaldırıldı ama gerçek bir demo akışı da yok |

### 🟡 Önemli (Kullanıcı deneyimi)

| Eksik | Açıklama |
|---|---|
| **Paylaş özelliği** | "Paylaş" butonu var ama işlevsiz. Story/screenshot paylaşımı çalışmıyor |
| **Favorit emoji gösterimi** | Dashboard'da emoji her zaman 😂 sabit, gerçek veriden gelmiyor |
| **Son analizler listesi** | Dashboard'daki son analizler hardcoded (Julianne Moore, Zuckerberg...) |
| **Profil verileri** | Profil sayfasında kullanıcıya ait gerçek veri yok |
| **Persona açıklama dili** | `t.appName === "Readr"` kontrolü kırık — dil tespiti düzeltilmeli |
| **İşleme ekranı adımları** | Sadece % göstergesi var, "hangi adım işleniyor" bilgisi yok |

### 🟢 İyileştirmeler (Sonraki iterasyon)

| Özellik | Açıklama |
|---|---|
| **Kelime bulutu** | Karşı tarafın en çok kullandığı kelimeler (stopword filtreli) |
| **Zaman çizelgesi** | "İlk 3 ay vs son 3 ay" karşılaştırması |
| **Emoji analizi detayı** | Top 5 emoji + kullanım sıklığı |
| **Gün bazlı aktivite** | Saatlik grafik yanına haftanın günleri grafiği |
| **Onboarding akışı** | İlk açılışta kısa bir "nasıl kullanılır" turu |
| **Haptic feedback** | Mobil için dokunma geri bildirimi (native API) |
| **Animasyonlu persona reveal** | Analiz tamamlanınca karakter dramatic şekilde ortaya çıksın |

---

## 4. Çıkarılacaklar (Kaldırılması Gereken)

| Öğe | Neden |
|---|---|
| **Login akışı (şimdilik)** | Auth yokken login ekranı kullanıcıyı yanıltıyor, doğrudan upload'a götür |
| **Pricing sayfası (MVP için)** | Ödeme altyapısı yokken fiyat sayfası göstermek erken — geliştirme sürecinde gizli tutulabilir |
| `t.appName === "Readr"` kontrolü | Uygulama adı artık "Insightful" — bu eski referans temizlenmeli |
| **Hardcoded demo isimler** | Julianne Moore, Zuckerberg — bunları ya gerçek veriyle doldur ya da tamamen kaldır |

---

## 5. Teknik Mimari (Mevcut)

```
Kullanıcı .txt dosyasını seçer
        ↓
Tarayıcıda parse + metrik çıkarımı (parseChatFile)
        ↓
Persona algoritması çalışır (getPersona) → karakter seçilir
        ↓
generateLocalSynthesis() → template-based yorum metni
        ↓
Dashboard + Insights ekranı
```

### Hedef Mimari (AI entegrasyonu sonrası)

```
Kullanıcı .txt dosyasını seçer
        ↓
Tarayıcıda parse + metrik çıkarımı (hiçbir ham mesaj çıkmaz)
        ↓
Sadece anonim metrikler → backend proxy
        ↓
Claude/GPT API → doğal dil yorumu
        ↓
Persona algoritması → karakter seçilir
        ↓
Dashboard + Insights ekranı
```

---

## 6. Sonraki Adımlar (Öncelik Sırası)

1. **`generateLocalSynthesis()`'i gerçek AI ile değiştir**
   - Backend proxy kur (Node.js / Vercel Edge Function)
   - API key güvenliği: asla frontend'e gömme
   - Claude veya OpenAI API bağla

2. **Parse hata yönetimi ekle**
   - Boş dosya, yanlış format, tek katılımcı gibi edge case'ler

3. **Gerçek demo akışı yaz**
   - Örnek bir `.txt` dosyası hardcode et, "Demo Gör" butonu onu yüklesin

4. **Paylaşım özelliği**
   - `html2canvas` veya `dom-to-image` ile persona kartını image olarak kaydet

5. **Dil tespiti düzelt**
   - `lang === 'tr'` kontrolü tutarlı şekilde kullanılsın

---

## 7. Monetizasyon (Planlanan)

| Plan | Fiyat | Mesaj Limiti |
|---|---|---|
| **Ücretsiz** | 0₺ | 200 mesaja kadar |
| **Pro** | 158₺ / ay | 2.000 mesaja kadar |
| **Unlimited** | 298₺ / ay | Sınırsız |

> App Store / Play Store in-app purchase — harici ödeme yok.

---

## 8. Teknik Stack

| Katman | Teknoloji |
|---|---|
| UI Framework | React + Vite |
| Stil | Tailwind CSS v4 |
| Animasyon | Framer Motion (motion/react) |
| Grafikler | Recharts |
| İkonlar | Lucide React |
| Font | Cinzel (başlık) + EB Garamond (gövde) |
| Parser | Vanilla JS (regex) |
| AI (hedef) | Claude API veya OpenAI via backend proxy |

---

## 9. Persona Karakterleri

5 karakter tipi, 2 cinsiyet = **10 karakter görseli**

| Karakter | Tanım | Tetikleyen Metrikler |
|---|---|---|
| **Logical Analyst** | Az emoji, uzun mesajlar | wordsPerMsg > 12, emojisPerMsg < 0.3 |
| **Energetic Extravert** | Bol emoji, hızlı yanıt | emojisPerMsg > 1.2 veya responseTime < 10 |
| **Empathetic Nurturer** | Dengeli, destekleyici | Default (diğerleri eşleşmezse) |
| **Dreamy Visionary** | Gece aktif, uzun mesajlar | nightRatio > 0.3 veya wordsPerMsg > 20 |
| **Cautious Skeptic** | Az mesaj, yavaş yanıt | messages < %20 veya responseTime > 30 |

---

*Bu doküman, Nisan 2026 geliştirme sürecini yansıtmaktadır.*