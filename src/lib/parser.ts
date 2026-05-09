
export interface ChatStats {
  participants: string[];
  totalMessages: number;
  messagesPerPerson: Record<string, number>;
  wordCountPerPerson: Record<string, number>;
  emojiCountPerPerson: Record<string, number>;
  hourlyActivity: Record<number, number>; // 0-23
  averageResponseTime: Record<string, number>; // in minutes
  doubleTextingCount: Record<string, number>;
  topEmojis: Record<string, Record<string, number>>;
  lastAnalysisDate: string;
}

export async function parseChatFile(fileContent: string): Promise<ChatStats> {
  const lines = fileContent.split('\n');
  const stats: ChatStats = {
    participants: [],
    totalMessages: 0,
    messagesPerPerson: {},
    wordCountPerPerson: {},
    emojiCountPerPerson: {},
    hourlyActivity: {},
    averageResponseTime: {},
    doubleTextingCount: {},
    topEmojis: {},
    lastAnalysisDate: new Date().toLocaleDateString()
  };

  // RegEx for different WhatsApp formats:
  // iOS: [24.10.2023 21:44:20] Name: Message
  // Android: 24/10/2023, 21:44 - Name: Message
  const lineRegex = /^[\[]?(\d{1,2}[\.\/]\d{1,2}[\.\/]\d{2,4}),?\s+(\d{1,2}:\d{2}(?::\d{2})?)[\]]?\s*(?:-?\s*)?([^:]+):\s*(.*)$/;

  let lastSender = "";
  let lastTimestamp: Date | null = null;
  const responseTimes: Record<string, number[]> = {};

  for (const line of lines) {
    const match = line.match(lineRegex);
    if (!match) continue;

    const [_, dateStr, timeStr, sender, message] = match;
    const cleanSender = sender.trim();
    
    // Add participant if new
    if (!stats.participants.includes(cleanSender)) {
      stats.participants.push(cleanSender);
      stats.messagesPerPerson[cleanSender] = 0;
      stats.wordCountPerPerson[cleanSender] = 0;
      stats.emojiCountPerPerson[cleanSender] = 0;
      stats.doubleTextingCount[cleanSender] = 0;
      stats.topEmojis[cleanSender] = {};
      responseTimes[cleanSender] = [];
    }

    stats.totalMessages++;
    stats.messagesPerPerson[cleanSender]++;

    // Time analysis
    const [day, month, year] = dateStr.split(/[\.\/]/);
    const [hour, minute] = timeStr.split(':');
    const fullYear = year.length === 2 ? `20${year}` : year;
    const currentTimestamp = new Date(Number(fullYear), Number(month) - 1, Number(day), Number(hour), Number(minute));

    const h = parseInt(hour);
    stats.hourlyActivity[h] = (stats.hourlyActivity[h] || 0) + 1;

    // Response Time & Double Texting
    if (lastTimestamp && lastSender) {
      const diffMs = currentTimestamp.getTime() - lastTimestamp.getTime();
      const diffMins = diffMs / (1000 * 60);

      if (lastSender === cleanSender) {
        if (diffMins > 5) { // If same person sends again after 5 mins
          stats.doubleTextingCount[cleanSender]++;
        }
      } else {
        // Someone else responded
        if (diffMins > 0 && diffMins < 1440) { // Max 24 hours to consider it a response
          responseTimes[cleanSender].push(diffMins);
        }
      }
    }

    // Word count
    const words = message.trim().split(/\s+/).filter(w => w.length > 0);
    stats.wordCountPerPerson[cleanSender] += words.length;

    // Emoji detection (simple regex)
    const emojiRegex = /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/g;
    const emojis = message.match(emojiRegex);
    if (emojis) {
      stats.emojiCountPerPerson[cleanSender] += emojis.length;
      emojis.forEach(e => {
        stats.topEmojis[cleanSender][e] = (stats.topEmojis[cleanSender][e] || 0) + 1;
      });
    }

    lastSender = cleanSender;
    lastTimestamp = currentTimestamp;
  }

  // Calculate averages
  stats.participants.forEach(p => {
    const times = responseTimes[p];
    if (times.length > 0) {
      stats.averageResponseTime[p] = Math.round(times.reduce((a, b) => a + b, 0) / times.length);
    } else {
      stats.averageResponseTime[p] = 0;
    }
  });

  if (stats.totalMessages === 0) {
    throw new Error('Geçerli WhatsApp mesajı bulunamadı. Lütfen dışa aktarılmış doğru bir .txt dosyası yüklediğinizden emin olun.');
  }
  if (stats.participants.length < 2) {
    throw new Error('Analiz için en az iki katılımcının olduğu bir sohbet yüklemelisiniz.');
  }

  return stats;
}
