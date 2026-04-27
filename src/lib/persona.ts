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
  label: string;
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

  const descriptions: Record<PersonaType, Record<'en' | 'tr', string>> = {
    'Logical Analyst': {
      en: "Focuses on facts and clear communication. Doesn't use many emojis but stays very consistent.",
      tr: "Gerçeklere ve net iletişime odaklanır. Çok fazla emoji kullanmaz ama oldukça tutarlıdır."
    },
    'Energetic Extravert': {
      en: "Full of life and expression! Uses many emojis and responds quickly to keep the conversation going.",
      tr: "Hayat ve ifade dolu! Sohbeti sürdürmek için çok sayıda emoji kullanır ve hızlı yanıt verir."
    },
    'Empathetic Nurturer': {
      en: "Warm and caring. Their messages are filled with emotional support and kindness.",
      tr: "Sıcak ve şefkatli. Mesajları duygusal destek ve nezaketle doludur."
    },
    'Dreamy Visionary': {
      en: "Often active at night, sending long and thoughtful messages. A true deep thinker.",
      tr: "Genellikle geceleri aktiftir, uzun ve düşünceli mesajlar gönderir. Gerçek bir derin düşünür."
    },
    'Cautious Skeptic': {
      en: "Observant and brief. Chooses their words carefully and takes time to respond.",
      tr: "Gözlemci ve kısa öz. Kelimelerini dikkatle seçer ve yanıt vermek için zaman ayırır."
    }
  };

  return {
    type,
    image: imageMap[type],
    label: type,
    description: descriptions[type]
  };
}
