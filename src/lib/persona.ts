import { ChatStats } from './parser';

export type PersonaType = 
  | 'Logical Analyst' 
  | 'Energetic Extravert' 
  | 'Empathetic Nurturer' 
  | 'Dreamy Visionary' 
  | 'Cautious Skeptic';

export interface PersonaInfo {
  type: PersonaType;
  image: string;
  label: Record<'en' | 'tr', string>;
  description: Record<'en' | 'tr', string>;
}

export function getPersona(stats: ChatStats, person: string, gender: 'Man' | 'Women' = 'Man'): PersonaInfo {
  const messages = stats.messagesPerPerson[person] || 1;
  const words = stats.wordCountPerPerson[person] || 0;
  const emojis = stats.emojiCountPerPerson[person] || 0;
  const responseTime = stats.averageResponseTime[person] || 0;
  const doubleTexts = stats.doubleTextingCount[person] || 0;
  
  const wordsPerMessage = words / messages;
  const emojisPerMessage = emojis / messages;
  const messageShare = messages / stats.totalMessages;

  // Activity at night (22:00 - 04:00)
  const nightActivity = (stats.hourlyActivity[22] || 0) + (stats.hourlyActivity[23] || 0) + 
                        (stats.hourlyActivity[0] || 0) + (stats.hourlyActivity[1] || 0) + 
                        (stats.hourlyActivity[2] || 0) + (stats.hourlyActivity[3] || 0);
  const nightRatio = nightActivity / messages;

  let type: PersonaType = 'Empathetic Nurturer'; // Default

  // Logic for Cautious Skeptic
  if (messages < stats.totalMessages * 0.2 || (wordsPerMessage < 5 && responseTime > 30)) {
    type = 'Cautious Skeptic';
  } 
  // Logic for Logical Analyst
  else if (wordsPerMessage > 12 && emojisPerMessage < 0.3) {
    type = 'Logical Analyst';
  }
  // Logic for Energetic Extravert
  else if (emojisPerMessage > 1.2 || (messageShare > 0.6 && responseTime < 10)) {
    type = 'Energetic Extravert';
  }
  // Logic for Dreamy Visionary
  else if (nightRatio > 0.3 || wordsPerMessage > 20) {
    type = 'Dreamy Visionary';
  }
  // Default stays Empathetic Nurturer

  const imageMap: Record<PersonaType, string> = {
    'Logical Analyst': `Logical Analyst_${gender}.png`,
    'Energetic Extravert': `The Energetic Extravert_${gender}.png`,
    'Empathetic Nurturer': gender === 'Man' ? 'Empathetic Nurteurer_Man.png' : 'Empathetic Nurturer_Women.png', // Note: typo in filename for man
    'Dreamy Visionary': `The Dreamy Visionary_${gender}.png`,
    'Cautious Skeptic': `Cautious Skeptic_${gender}.png`
  };

  const labels: Record<PersonaType, Record<'en' | 'tr', string>> = {
    'Logical Analyst': { en: 'The Logical Analyst', tr: 'Analitik Stratejist' },
    'Energetic Extravert': { en: 'The Energetic Extravert', tr: 'Enerjik Sosyal Kelebek' },
    'Empathetic Nurturer': { en: 'The Empathetic Nurturer', tr: 'Duygusal Destekçi' },
    'Dreamy Visionary': { en: 'The Dreamy Visionary', tr: 'Hayalperest Vizyoner' },
    'Cautious Skeptic': { en: 'The Cautious Skeptic', tr: 'Gizemli Gözlemci' }
  };

  const descriptions: Record<PersonaType, Record<'en' | 'tr', string>> = {
    'Logical Analyst': {
      en: "Logical, detail-oriented, speaks briefly and concisely, acts based on data. Generally uses proper spelling and clear information in messages.",
      tr: "Mantıklı, detaycı, az ve öz konuşan, veriye dayalı hareket eden tip. Mesajlarında genellikle düzgün bir imla ve net bilgiler kullanır."
    },
    'Energetic Extravert': {
      en: "Uses plenty of emojis, never misses an exclamation mark, writes quickly and excitedly. Radiates positive energy.",
      tr: "Bolca emoji kullanan, ünlemi eksik etmeyen, hızlı ve heyecanlı yazan tip. Pozitif enerji saçar."
    },
    'Empathetic Nurturer': {
      en: "Uses soft language, validates the other person, loves affectionate terms, writes long and thoughtful messages.",
      tr: "Yumuşak bir dil kullanan, karşısındakini onaylayan, 'canım, tatlım' gibi hitapları seven, uzun ve düşünceli mesajlar yazan tip."
    },
    'Dreamy Visionary': {
      en: "Speaks abstractly, full of ideas, sometimes goes off-topic, sends creative and inspiring messages.",
      tr: "Soyut konuşan, fikirlerle dolu, bazen konudan sapan, yaratıcı ve ilham verici mesajlar atan tip."
    },
    'Cautious Skeptic': {
      en: "Gives short answers, usually says 'hmm, we'll see, ok', distant but intriguing. Messages might be a bit cold but deep.",
      tr: "Kısa cevaplar veren, genellikle 'hmm, bakarız, tamam' diyen, mesafeli ama merak uyandırıcı tip. Mesajları biraz soğuk ama derin olabilir."
    }
  };

  return {
    type,
    image: imageMap[type],
    label: labels[type],
    description: descriptions[type]
  };
}
