
export type Language = 'en' | 'tr';

export const translations = {
  en: {
    appName: "Readr",
    appFullName: "Readr",
    nav: {
      home: "Home",
      analyze: "Analyze",
      insights: "Insights",
      settings: "Settings"
    },
    welcome: {
      headline: "Understand patterns, not labels.",
      description: "Transform your digital conversations into meaningful insights with privacy-first analytics.",
      getStarted: "Get Started",
      securityNote: "Your messages never leave your phone",
      features: [
        { label: "PRIVATE", title: "Local Analysis", desc: "Data processing happens entirely on your device using on-device machine learning." },
        { label: "INTELLIGENT", title: "Sentiment Flows", desc: "Visualize how your communication mood shifts over days, weeks, and months." },
        { label: "OBJECTIVE", title: "Active Hours", desc: "Identify your peak engagement times to help manage your digital well-being." }
      ]
    },
    login: {
      subtitle: "Your private sanctuary for digital reflection and pattern awareness.",
      google: "Continue with Google",
      apple: "Continue with Apple",
      or: "or",
      emailLabel: "Email Address",
      emailPlaceholder: "name@example.com",
      signIn: "Sign In",
      securityTitle: "Local-first security",
      securityDesc: "Your messages never leave your device unencrypted. Insights are generated locally to ensure total privacy.",
      encryption: "Device Encryption",
      activeStatus: "Active",
      links: ["Privacy Policy", "Terms of Service"]
    },
    upload: {
      title: "Transform your data",
      description: "Upload your conversation history to unlock patterns, sentiment analysis, and digital well-being insights.",
      selectTitle: "Select .txt File",
      selectSubtitle: "Drag and drop or click to browse",
      demoAnalysis: "View Demo Analysis",
      checklistTitle: "Security Checklist",
      checklist: [
        { title: "Local Processing", desc: "Your messages never leave this device. Computation is 100% local." },
        { title: "Auto Deletion", desc: "Session data is purged immediately after closing the tab." },
        { title: "Anonymous Only", desc: "Only non-identifiable statistics are collected for improvement." },
        { title: "Zero Storage", desc: "We do not store your message files or processed transcripts." }
      ],
      button: "Analyze Data",
      supported: "Supported: WhatsApp .txt / Telegram export / kollektiv standard"
    },
    processing: {
      decoding: "Decoding",
      headline: "Extracting patterns...",
      description: "Our local-first engine is decoding your message structures while maintaining absolute privacy.",
      logTitle: "Architecture Log",
      step1: "Reading local file",
      step2: "Calculating metrics",
      step3: "Permanent Wipe",
      badge: "Encrypted Local Tunnel",
      note: "Estimated time: < 30s. Do not interrupt the connection to ensure data integrity."
    },
    insights: {
      category: "DIGITAL REFLECTION",
      headline: "Analysis for",
      synthesisTitle: "Communication Synthesis",
      synthesis: [
        "Your communication style leans heavily towards meaningful, deep-dive conversations rather than rapid-fire exchanges. You tend to wait until you have a fully formed thought before hitting send, which contributes to the high quality of your interactions. This 'thoughtful pause' is a hallmark of an intentional communicator.",
        "Interestingly, your engagement peaks in the late evening hours, suggesting that your cognitive energy for social connection thrives when the world slows down. You often act as the 'anchor' in group chats, providing stabilizing questions that keep the dialogue moving forward without overwhelming participants with volume.",
        "The data shows a consistent pattern of curiosity; you are twice as likely to ask an open-ended question than to provide a short directive. This fosters a safe space for others to express themselves, positioning you as a highly empathetic digital presence within your primary circles."
      ],
      study: "Temporal Shifts Study",
      confidence: "Analysis Confidence",
      signaturesTitle: "Behavioral Signatures",
      signatures: {
        nightOwl: { label: "Activity Peak", title: "Night Owl", desc: "70% of your most active communication occurs between 9 PM and 1 AM." },
        quickResponder: { label: "Responsiveness", title: "Quick Responder", desc: "You maintain a 4m average response time for direct inquiries." },
        questioner: { label: "Inquiry Ratio", title: "The Questioner", desc: "1 in 3 of your messages contains a question, driving engagement." },
        starter: { label: "Initiative", title: "Conversation Starter", desc: "You frequently initiate new threads, acting as a social catalyst." }
      },
      privacyGuaranteed: "Your Privacy, Guaranteed.",
      privacyDesc: "This analysis was performed locally on your device. Your raw message data never left your hardware and was discarded immediately after patterns were identified.",
      auditSecurity: "Audit Security",
      shareToStory: "Share to Story",
      comparison: {
        title: "Contrast Analysis",
        subtitle: "How you compare against the other party in this conversation context.",
        wordCount: "Word Output",
        responseTime: "Average Response Time",
        emojis: "Emoji Usage",
        doubleTexting: "Double Texting Rate",
        messages: "Message Count",
        metrics: {
          words: "Words",
          minutes: "Minutes",
          emojis: "Emojis"
        }
      }
    },
    pricing: {
      title: "Unlock Deeper Insights",
      subtitle: "Choose the plan that fits your communication patterns. Pay only for the depth you need.",
      plans: {
        free: {
          name: "Free",
          price: "0₺",
          limit: "Up to 200 messages",
          features: ["Basic Analysis", "Local Processing", "Auto Deletion"]
        },
        pro: {
          name: "Pro",
          price: "158₺ / month",
          limit: "Up to 2,000 messages",
          features: ["Deep Analysis + History", "Sentiment Flows", "Behavioral Signatures"]
        },
        unlimited: {
          name: "Unlimited",
          price: "298₺ / month",
          limit: "Unlimited messages",
          features: ["Everything in Pro", "Priority Processing", "Export to PDF"]
        }
      },
      cta: "Choose Plan",
      current: "Current Plan"
    },
    profile: {
      role: "Communication Patterns Analyst",
      memberSince: "Member since",
      historyTitle: "Analysis History",
      selectedInsight: "Selected Insight",
      deepWorkTitle: "Deep Work Balance",
      deepWorkDesc: "Your message frequency dropped by 14% during peak focus hours this week, suggesting improved boundary setting.",
      stats: {
        run: "Analyses Run",
        clusters: "Pattern Clusters"
      },
      configTitle: "Configuration",
      language: "Language",
      privacy: "Privacy & Security",
      privacyDesc: "Manage data encryption and storage",
      notifications: "Notification Preferences",
      notificationsDesc: "Customize when and how you receive insights",
      about: "About Readr",
      aboutDesc: "Version 2.4.1 • (Kol-2024)",
      signOut: "Sign Out"
    },
    dashboard: {
      title: "Recent Insights",
      subtitle: "A summary of your latest analyzed interactions and patterns.",
      newAnalysis: "New Analysis",
      emptyState: "No analyses found. Upload a chat to reveal hidden patterns.",
      recentChats: "Recent Analysis History",
      viewFull: "Full Analysis",
      lastAnalyzed: "Last analyzed"
    }
  },
  tr: {
    appName: "Readr",
    appFullName: "Readr",
    nav: {
      home: "Anasayfa",
      analyze: "Analiz Et",
      insights: "Öngörüler",
      settings: "Ayarlar"
    },
    welcome: {
      headline: "Kalıpları anlayın, etiketleri değil.",
      description: "Dijital konuşmalarınızı, gizlilik öncelikli analizlerle anlamlı öngörülere dönüştürün.",
      getStarted: "Başla",
      securityNote: "Mesajlarınız asla telefonunuzdan ayrılmaz",
      features: [
        { label: "GİZLİ", title: "Yerel Analiz", desc: "Veri işleme, cihaz içi makine öğrenimi kullanılarak tamamen kendi cihazınızda gerçekleşir." },
        { label: "AKILLI", title: "Duygu Akışları", desc: "İletişim ruh halinizin günler, haftalar ve aylar içindeki değişimini görselleştirin." },
        { label: "OBJEKTİF", title: "Aktif Saatler", desc: "Dijital refahınızı yönetmenize yardımcı olacak en yoğun etkileşim saatlerinizi belirleyin." }
      ]
    },
    login: {
      subtitle: "Dijital yansıma ve örüntü farkındalığı için özel sığınağınız.",
      google: "Google ile devam et",
      apple: "Apple ile devam et",
      or: "veya",
      emailLabel: "E-posta Adresi",
      emailPlaceholder: "isim@ornek.com",
      signIn: "Giriş Yap",
      securityTitle: "Önce yerel güvenlik",
      securityDesc: "Mesajlarınız cihazınızdan asla şifrelenmemiş olarak ayrılmaz. Öngörüler, tam gizlilik sağlamak için yerel olarak oluşturulur.",
      encryption: "Cihaz Şifreleme",
      activeStatus: "Aktif",
      links: ["Gizlilik Politikası", "Hizmet Şartları"]
    },
    upload: {
      title: "Verilerinizi dönüştürün",
      description: "Örüntüleri, duygu analizini ve dijital refah öngörülerini ortaya çıkarmak için konuşma geçmişinizi yükleyin.",
      selectTitle: ".txt Dosyası Seçin",
      selectSubtitle: "Sürükleyip bırakın veya göz atmak için tıklayın",
      demoAnalysis: "Örnek Analizi İncele",
      checklistTitle: "Güvenlik Kontrol Listesi",
      checklist: [
        { title: "Yerel İşleme", desc: "Mesajlarınız asla bu cihazdan ayrılmaz. Hesaplama %100 yereldir." },
        { title: "Otomatik Silme", desc: "Oturum verileri, sekmeyi kapattıktan hemen sonra temizlenir." },
        { title: "Sadece Anonim", desc: "Geliştirme için yalnızca tanımlanamayan istatistikler toplanır." },
        { title: "Sıfır Depolama", desc: "Mesaj dosyalarınızı veya işlenmiş dökümleri saklamıyoruz." }
      ],
      button: "Veriyi Analiz Et",
      supported: "Desteklenenler: WhatsApp .txt / Telegram dışa aktarma / kollektiv standart"
    },
    processing: {
      decoding: "Kod Çözülüyor",
      headline: "Örüntüler çıkarılıyor...",
      description: "Yerel öncelikli motorumuz, tam gizliliği koruyarak mesaj yapılarınızı çözümlüyor.",
      logTitle: "Mimari Günlüğü",
      step1: "Yerel dosya okunuyor",
      step2: "Metrikler hesaplanıyor",
      step3: "Kalıcı Silme",
      badge: "Şifreli Yerel Tünel",
      note: "Tahmini süre: < 30 sn. Veri bütünlüğünü sağlamak için bağlantıyı kesmeyin."
    },
    insights: {
      category: "DİJİTAL YANSIMA",
      headline: "Analiz Sahibi:",
      synthesisTitle: "İletişim Sentezi",
      synthesis: [
        "İletişim tarzınız, hızlı alışverişlerden ziyade anlamlı ve derinlemesine konuşmalara ağırlık veriyor. Göndermeden önce düşüncelerinizi tam olarak şekillendirmeyi tercih ediyorsunuz, bu da etkileşimlerinizin yüksek kalitesine katkıda bulunuyor. Bu 'düşünceli duraklama', bilinçli bir iletişimcinin imzasıdır.",
        "İlginç bir şekilde, etkileşiminiz akşam geç saatlerde zirveye ulaşıyor; bu da sosyal bağlantı için bilişsel enerjinizin dünya yavaşladığında geliştiğini gösteriyor. Genelde grup sohbetlerinde, katılımcıları hacimle boğmadan diyaloğu ilerleten dengeleyici sorular soran bir 'demir' görevi görüyorsunuz.",
        "Veriler tutarlı bir merak örüntüsü gösteriyor; açık uçlu bir soru sorma olasılığınız, kısa bir talimat verme olasılığınızdan iki kat daha fazla. Bu, başkalarının kendilerini ifade etmeleri için güvenli bir alan oluşturuyor ve sizi birincil çevrelerinizde son derece empatik bir dijital varlık olarak konumlandırıyor."
      ],
      study: "Zamansal Değişim Çalışması",
      confidence: "Analiz Güveni",
      signaturesTitle: "Davranışsal İmzalar",
      signatures: {
        nightOwl: { label: "Aktivite Zirvesi", title: "Gece Kuşu", desc: "En aktif iletişiminizin %70'i 21:00 ile 01:00 saatleri arasında gerçekleşiyor." },
        quickResponder: { label: "Yanıt Verebilirlik", title: "Hızlı Yanıtlayıcı", desc: "Doğrudan sorgular için ortalama 4 dakikalık bir yanıt süresi sağlıyorsunuz." },
        questioner: { label: "Soru Oranı", title: "Sorgulayıcı", desc: "Mesajlarınızdan 1'i soru içeriyor ve etkileşimi artırıyor." },
        starter: { label: "İnisiyatif", title: "Sohbet Başlatıcı", desc: "Sık sık yeni başlıklar başlatarak sosyal bir katalizör görevi görüyorsunuz." }
      },
      privacyGuaranteed: "Gizliliğiniz Garanti Altında.",
      privacyDesc: "Bu analiz yerel olarak cihazınızda gerçekleştirilmiştir. Ham mesaj verileriniz donanımınızdan asla ayrılmadı ve örüntüler belirlendikten hemen sonra silindi.",
      auditSecurity: "Güvenliği Denetle",
      shareToStory: "Hikayede Paylaş",
      comparison: {
        title: "Kontrast Analizi",
        subtitle: "Bu sohbet bağlamında diğer tarafla nasıl kıyaslandığınız.",
        wordCount: "Kelime Üretimi",
        responseTime: "Ortalama Yanıt Süresi",
        emojis: "Emoji Kullanımı",
        doubleTexting: "Üst Üste Mesaj",
        messages: "Mesaj Sayısı",
        metrics: {
          words: "Kelime",
          minutes: "Dakika",
          emojis: "Emoji"
        }
      }
    },
    pricing: {
      title: "Derin İçgörülerin Kilidini Aç",
      subtitle: "İletişim tarzına en uygun planı seç. Yalnızca ihtiyacın olan analiz derinliği için ödeme yap.",
      plans: {
        free: {
          name: "Ücretsiz",
          price: "0₺",
          limit: "200 mesaja kadar",
          features: ["Temel analiz", "Cihaz içi işleme", "Otomatik silme"]
        },
        pro: {
          name: "Pro",
          price: "158₺ / ay",
          limit: "2.000 mesaja kadar",
          features: ["Derin analiz + Geçmiş", "Duygu akışları", "Davranışsal imzalar"]
        },
        unlimited: {
          name: "Sınırsız",
          price: "298₺ / ay",
          limit: "Sınırsız mesaj",
          features: ["Pro'daki her şey", "Öncelikli API işlemi", "VIP Destek"]
        }
      },
      cta: "Planı Seç",
      current: "Mevcut Plan"
    },
    profile: {
      role: "İletişim Örüntüleri Analisti",
      memberSince: "Üyelik Tarihi",
      historyTitle: "Analiz Geçmişi",
      selectedInsight: "Seçilen Öngörü",
      deepWorkTitle: "Derin Çalışma Dengesi",
      deepWorkDesc: "Mesaj sıklığınız bu hafta yoğun odaklanma saatlerinde %14 düştü, bu da gelişmiş bir sınır belirleme yetisine işaret ediyor.",
      stats: {
        run: "Yapılan Analizler",
        clusters: "Örüntü Kümeleri"
      },
      configTitle: "Yapılandırma",
      language: "Dil",
      privacy: "Gizlilik ve Güvenlik",
      privacyDesc: "Veri şifreleme ve depolamayı yönetin",
      notifications: "Bildirim Tercihleri",
      notificationsDesc: "Öngörüleri ne zaman ve nasıl alacağınızı özelleştirin",
      about: "Readr Hakkında",
      aboutDesc: "Sürüm 2.4.1 • (Kol-2024)",
      signOut: "Oturumu Kapat"
    },
    dashboard: {
      title: "Son Öngörüler",
      subtitle: "Son analiz edilen etkileşimlerinizin ve örüntülerinizin özeti.",
      newAnalysis: "Yeni Analiz",
      emptyState: "Analiz bulunamadı. Gizli örüntüleri ortaya çıkarmak için bir sohbet yükleyin.",
      recentChats: "Son Analiz Geçmişi",
      viewFull: "Tam Analiz",
      lastAnalyzed: "Son analiz"
    }
  }
};
