export function formatNumber(number: number, delimiter: string = ' '): string {
  const numberStr = Math.floor(number).toString(); // Convert to integer and then to string
  const reversedNumberStr = numberStr.split('').reverse().join(''); // Reverse the string
  const parts: string[] = [];

  for (let i = 0; i < reversedNumberStr.length; i += 3) {
    parts.push(reversedNumberStr.slice(i, i + 3)); // Split into chunks of 3
  }
  return parts.reverse().join(delimiter);
}

// Send message to chat
export async function sendMessageToChat(chatId: string, message: string) {
  await strapi.bot.sendMessage(chatId, message, { parse_mode: 'HTML' });
}

