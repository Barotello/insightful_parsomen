import { ChatStats } from './parser';

export function generateLocalSynthesis(stats: ChatStats, lang: 'en' | 'tr'): string[] {
  const me = stats.participants[0];
  const partner = stats.participants[1] || "Partner";

  const meMsgs = stats.messagesPerPerson[me] || 0;
  const partnerMsgs = stats.messagesPerPerson[partner] || 0;
  const total = stats.totalMessages;

  const isTR = lang === 'tr';

  const synthesis: string[] = [];

  // 1. Message Volume Analysis
  const meRatio = meMsgs / total;
  if (meRatio > 0.6) {
    synthesis.push(isTR 
      ? `Bu sohbette baskın taraf sensin. Mesajların %${Math.round(meRatio * 100)}'ü senden geliyor, bu da konuyu senin yönlendirdiğini gösteriyor.`
      : `You are the dominant voice in this chat. With %${Math.round(meRatio * 100)} of messages coming from you, you tend to drive the conversation forward.`);
  } else if (meRatio < 0.4) {
    synthesis.push(isTR
      ? `${partner} bu sohbette daha çok konuşan taraf. Sen daha çok dinleyici ve tepki veren bir pozisyondasın.`
      : `${partner} is the more talkative one here. You take on a more reflective and responsive role.`);
  } else {
    synthesis.push(isTR
      ? "İletişim dengeniz oldukça sağlıklı. Her iki taraf da sohbete neredeyse eşit oranda katılım sağlıyor."
      : "Your communication balance is very healthy. Both parties contribute almost equally to the dialogue.");
  }

  // 2. Timing Analysis
  const nightMsgs = [21, 22, 23, 0, 1].reduce((acc, h) => acc + (stats.hourlyActivity[h] || 0), 0);
  const nightRatio = nightMsgs / total;
  if (nightRatio > 0.4) {
    synthesis.push(isTR
      ? "Siz tam bir gece kuşusunuz! Konuşmalarınızın büyük bir kısmı gece geç saatlerde derinleşiyor."
      : "You guys are total night owls! A significant portion of your conversations deepens during late-night hours.");
  }

  // 3. Response Time
  const meTime = stats.averageResponseTime[me] || 0;
  const partnerTime = stats.averageResponseTime[partner] || 0;
  if (meTime < partnerTime / 2) {
    synthesis.push(isTR
      ? `Sen çok daha hızlı yanıt veriyorsun. ${partner} mesajlarına dönmeden önce daha çok düşünmeyi tercih ediyor olabilir.`
      : `You respond much faster. ${partner} might prefer taking more time to reflect before getting back to you.`);
  }

  // 4. Emoji Usage
  const meEmoji = stats.emojiCountPerPerson[me] || 0;
  const partnerEmoji = stats.emojiCountPerPerson[partner] || 0;
  if (meEmoji > partnerEmoji * 1.5) {
    synthesis.push(isTR
      ? "Duygularını ifade ederken emojilere çok daha fazla başvuruyorsun. Bu senin daha dışadönük bir dijital tarzın olduğunu gösteriyor."
      : "You rely much more on emojis to express your emotions, suggesting a more expressive and outgoing digital style.");
  }

  return synthesis;
}
