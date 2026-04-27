# WhatsApp Mesaj Analiz Uygulaması — Proje Dokümanı

> Bu doküman, geliştirme sürecine başlamadan önce yapılan fikir ve mimari tartışmasının özetidir.

---

## 1. Vizyon

İnsanları daha iyi tanımanın en doğal yollarından biri mesajlaşma örüntülerini anlamaktır. Bu uygulama, WhatsApp'tan dışa aktarılan `.txt` dosyalarını okuyarak kişi veya ilişki dinamiği hakkında anlamlı, okunabilir bir analiz üretir.

**Ana felsefe:** Etiketlemek değil, örüntü göstermek. "Bu kişi narsist" demek yerine "bu kişi mesajlarında şu örüntüleri gösteriyor" demek.

---

## 2. Hedef Kitle

- Her yaştan kullanıcı
- Hem kendi mesajlarını hem de karşı tarafın mesajlarını analiz etmek isteyenler
- İlişki dinamiklerini anlamak isteyenler

---

## 3. Platform Kararı

**React Native (iOS + Android)**

| Neden React Native? | Açıklama |
|---|---|
| Cross-platform | Tek kod tabanı, iki platform |
| JavaScript ekosistemi | Geniş kütüphane desteği, AI araçlarıyla kolay entegrasyon |
| Düşük sürtünme | WhatsApp zaten telefonda, export direkt oradan |
| AI destekli geliştirme | JS tabanlı olduğu için yapay zeka araçlarıyla üretilen kod daha tutarlı |
| Mac uyumu | iOS simülatörü ve App Store çıkışı Mac'te sorunsuz |

**Geliştirme Ortamı:** Mac bilgisayar üzerinde AI destekli editör

---

## 4. Mimari

### Hibrit Güvenlik Mimarisi

```
Kullanıcı .txt dosyasını seçer
        ↓
Telefonda parse + metrik çıkarımı (yerel kod)
        ↓
Ham mesajlar telefondan otomatik silindi ✓
        ↓
Sadece anonim metrikler API'ye gönderilir
        ↓
LLM yorum üretir
        ↓
Sonuç ekrana gelir — yalnızca analiz sonucu saklanır
```

### Güvenlik Prensipleri

- Ham mesajlar **hiçbir zaman** sunucuya gönderilmez
- Analiz tamamlandıktan sonra mesajlar cihazdan otomatik silinir
- Kullanıcıya silme işlemi **gerçek zamanlı** gösterilir (şeffaflık)
- Sunucuya yalnızca türetilmiş, anonim metrikler gider

---

## 5. Teknik Katmanlar

### 5.1 Parse Katmanı (Yerel)

WhatsApp export formatı standarttır ve parse edilmesi kolaydır:

```
[23.01.2024, 14:32:05] Ahmet: Naber ya nasılsın
[23.01.2024, 14:33:12] Ayşe: İyiyim sen?
```

Regex ile şunlar çıkarılır:
- Tarih ve saat
- Kişi adı
- Mesaj içeriği

### 5.2 Metrik Çıkarım Katmanı (Yerel, kod ile)

| Metrik | Açıklama |
|---|---|
| Yanıt süresi | Mesajlar arası geçen ortalama süre |
| Mesaj uzunluğu | Ortalama karakter / kelime sayısı |
| Emoji yoğunluğu | Emoji kullanım oranı |
| Aktif saatler | Hangi saatlerde mesaj atılıyor |
| Soru sorma oranı | Her kaç mesajda bir soru var |
| Konuşma başlatma | Kim daha çok başlatıyor |
| Konuşma bitirme | Kim son mesajı bırakıyor |
| Mesaj dağılımı | Kim daha çok yazıyor |

### 5.3 Yorum Katmanı (LLM — API)

Sunucuya **yalnızca metrikler** gider, ham mesaj içeriği asla gitmez.

LLM bu metrikleri alır ve doğal dilde yorum üretir.

---

## 6. Kullanıcı Akışı (UX)

```
Açılış Ekranı
     ↓
Dosya Seç (.txt)
     ↓
İşleniyor... (progress göstergesi + "mesajlar silindi" bildirimi)
     ↓
Analiz Sonucu
```

### Sonuç Ekranı Yapısı

**1. Doğal dil yorumu** (3-5 paragraf)
Sanki bir arkadaşın o kişinin mesajlarını okuyup sana anlattığı gibi. Skor yok, yüzde yok, etiket yok.

**2. Öne çıkan örüntü kartları**

```
🌙 Gece kuşu       → Mesajlarının %70'i gece
⚡ Hızlı yanıtçı   → Ortalama yanıt süresi 4 dk
❓ Soru soran      → Her 3 mesajda 1 soru
💬 Söz hakkı       → Konuşmanın %60'ını o yönetiyor
```

---

## 7. MVP Kapsamı

### ✅ MVP'de olan
- Tek dosya yükleme ve analiz
- İki taraf için ayrı analiz (A kişisi / B kişisi)
- Doğal dil yorum
- Örüntü kartları
- Otomatik mesaj silme + şeffaf bildirim

### ❌ MVP'de olmayan (sonraki versiyonlar)
- Zaman içinde takip ("3 ay önce vs şimdi")
- Birden fazla konuşma karşılaştırma
- Grafik ve görsel istatistikler
- Hesap / profil sistemi

---

## 8. Monetizasyon ve Ödeme Planı

### Model: Freemium + Mesaj Limitli Abonelik

Fiyatlandırma mesaj sayısına göre yapılandırılmıştır. Uzun konuşma = daha fazla LLM token = daha yüksek maliyet. Bu model hem kullanıcı için adil hem de sürdürülebilir.

| Plan | Fiyat | Mesaj Limiti | Kapsam |
|---|---|---|---|
| **Ücretsiz** | 0₺ | 200 mesaja kadar | Temel analiz |
| **Pro** | 158₺ / ay | 2.000 mesaja kadar | Derin analiz + geçmiş |
| **Unlimited** | 298₺ / ay | Sınırsız | Her şey + öncelikli işlem |

### Kullanıcı Edinme Stratejisi

Kayıt zorunlu olmakla birlikte değer önce gösterilir, sonra kayıt istenir:

```
Dosyayı yükle → Analizi GÖR (önce değeri hissettir)
        ↓
Sonucu okumak için kayıt ol
```

### Önemli Notlar

- Yıllık plan ilerleyen versiyonlarda eklenebilir, şimdilik aylık yeterli
- App Store ve Play Store kendi ödeme altyapısını kullanır (in-app purchase), harici ödeme sistemi gerekmez
- Ücretsiz limit kasıtlı olarak düşük tutulmuştur, kullanıcı değeri görür ama yetersiz hisseder

---

## 9. Açık Sorular

Geliştirmeye başlamadan önce netleştirilmesi gerekenler:

1. **LLM seçimi:** Claude API mi, OpenAI mi, başka bir şey mi?
2. **Backend var mı?** Sadece API proxy yeterli mi, yoksa bir sunucu gerekiyor mu?
3. **App Store / Play Store** için geliştirici hesapları açıldı mı?

---

## 10. Yapay Zeka Entegrasyonu

### Akış

```
Metrikler → Prompt oluştur → Claude API → Yorum metni → Ekran
```

### Prompt Yapısı

Ham mesajlar asla API'ye gönderilmez. Yalnızca çıkarılmış metrikler prompt'a eklenir:

```
Aşağıdaki mesajlaşma metriklerine göre bu kişiyi yorumla:

- Ortalama yanıt süresi: 4 dakika
- Mesajların %70'i 22:00-02:00 arası
- Her 3 mesajda 1 soru soruyor
- Konuşmaların %65'ini kendisi başlatıyor
- Ortalama mesaj uzunluğu: 12 kelime

Yorum tarzı: Doğal, arkadaşça, etiket kullanma.
```

### API Key Güvenliği

API key asla uygulama içine gömülmez. Basit bir backend proxy kullanılır:

| Seçenek | Durum |
|---|---|
| Key'i uygulamaya gömmek | ❌ Tehlikeli, kesinlikle yapma |
| Kendi backend proxy'in | ✅ Doğru yöntem |

Backend sadece bir proxy görevi görür, karmaşık değildir. Node.js ile birkaç satır kod yeterlidir.

---

## 11. Sonraki Adım

Doküman hazır, mimari netleşti. Sıradaki adım:

1. React Native proje iskeletini kurmak (`npx react-native init`)
2. Parse katmanını yazmak ve test etmek
3. UI tasarımına başlamak
4. Backend proxy kurmak
5. Claude API entegrasyonunu eklemek

---

*Bu doküman Claude ile yapılan ön tasarım görüşmesi sonucunda oluşturulmuştur.*