import { ChatStats } from './parser';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

export async function generateAISynthesis(
  stats: ChatStats,
  analysisTarget: 'self' | 'partner',
  lang: 'tr' | 'en'
): Promise<string[]> {
  const me = analysisTarget === 'self' ? stats.participants[0] : (stats.participants[1] || stats.participants[0]);
  const partner = analysisTarget === 'self' ? (stats.participants[1] || 'Partner') : stats.participants[0];

  const meMessages = stats.messagesPerPerson[me] || 0;
  const partnerMessages = stats.messagesPerPerson[partner] || 0;
  const meWords = stats.wordCountPerPerson[me] || 0;
  const partnerWords = stats.wordCountPerPerson[partner] || 0;
  const meEmojis = stats.emojiCountPerPerson[me] || 0;
  const partnerEmojis = stats.emojiCountPerPerson[partner] || 0;
  const meResponseTime = stats.averageResponseTime[me] || 0;
  const partnerResponseTime = stats.averageResponseTime[partner] || 0;
  const meDoubleText = stats.doubleTextingCount[me] || 0;
  const partnerDoubleText = stats.doubleTextingCount[partner] || 0;

  const meWordsPerMsg = meMessages > 0 ? Math.round(meWords / meMessages) : 0;
  const partnerWordsPerMsg = partnerMessages > 0 ? Math.round(partnerWords / partnerMessages) : 0;

  // Find peak hour
  const peakHour = Object.entries(stats.hourlyActivity)
    .sort((a, b) => b[1] - a[1])[0]?.[0] || '?';

  const nightActivity = (
    (stats.hourlyActivity[22] || 0) +
    (stats.hourlyActivity[23] || 0) +
    (stats.hourlyActivity[0] || 0) +
    (stats.hourlyActivity[1] || 0) +
    (stats.hourlyActivity[2] || 0)
  );
  const nightPercent = Math.round((nightActivity / stats.totalMessages) * 100);

  const messageSharePartner = Math.round((partnerMessages / stats.totalMessages) * 100);

  const metrics = `
Konuşma: ${me} ve ${partner} arasında
Toplam mesaj: ${stats.totalMessages}

${partner} için metrikler:
- Toplam mesaj: ${partnerMessages} (toplam konuşmanın %${messageSharePartner}'i)
- Mesaj başına ortalama kelime: ${partnerWordsPerMsg}
- Toplam emoji: ${partnerEmojis}
- Ortalama yanıt süresi: ${partnerResponseTime} dakika
- Ardışık mesaj (double texting): ${partnerDoubleText} kez
- En aktif saat: ${peakHour}:00
- Gece saatlerinde (%22:00-02:00) gelen mesaj oranı: %${nightPercent}

${me} için metrikler (referans):
- Toplam mesaj: ${meMessages}
- Mesaj başına ortalama kelime: ${meWordsPerMsg}
- Toplam emoji: ${meEmojis}
- Ortalama yanıt süresi: ${meResponseTime} dakika
- Ardışık mesaj (double texting): ${meDoubleText} kez
  `.trim();

  const prompt = lang === 'tr'
    ? `Sen bir ilişki ve iletişim analisti olarak konuşuyorsun. Aşağıdaki mesajlaşma metriklerine dayanarak ${partner} adlı kişinin iletişim tarzını yorumla.

${metrics}

Kurallar:
- Etiket yapıştırma ("narsist", "ilgisiz" gibi kelimeler kullanma)
- Yargılamadan gözlem yap, örüntüleri açıkla
- Sıcak, arkadaşça bir dil kullan — sanki bir arkadaşına anlatıyorsun
- Kesinlikle 3 paragraf yaz, her biri farklı bir boyutu ele alsın
- Her paragraf 2-3 cümle olsun
- Türkçe yaz
- Skor, yüzde veya grafik referansı verme — sadece doğal dil kullan`
    : `You are a relationship and communication analyst. Based on the messaging metrics below, interpret ${partner}'s communication style.

${metrics}

Rules:
- Do not label ("narcissist", "avoidant", etc.)
- Observe without judgment, explain patterns
- Use warm, friendly language — as if telling a friend
- Write exactly 3 paragraphs, each covering a different dimension
- Each paragraph should be 2-3 sentences
- Write in English
- No scores, percentages, or chart references — natural language only`;

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.8,
          maxOutputTokens: 512,
        }
      })
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    // Split into paragraphs
    const paragraphs = text
      .split(/\n\n+/)
      .map((p: string) => p.trim())
      .filter((p: string) => p.length > 0);

    return paragraphs.length > 0 ? paragraphs : [text];
  } catch (error) {
    console.error('Gemini API error:', error);
    // Fallback to local synthesis
    const { generateLocalSynthesis } = await import('./analyzer');
    return generateLocalSynthesis(stats, lang);
  }
}
