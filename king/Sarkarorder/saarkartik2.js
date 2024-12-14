import axios from 'axios';
import config from '../../config.cjs';

const tiktokDownloader = async (m, Matrix) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const query = m.body.slice(prefix.length + cmd.length).trim();

  if (!['tiktok2', 'tt2'].includes(cmd)) return;

  if (!query) {
    return m.reply(`Usage: *${prefix}${cmd} <TikTok URL>*\n\nExample: *${prefix}${cmd} https://www.tiktok.com/@username/video/123456789*`);
  }

  try {
    // Fetch video details from the API
    const apiUrl = `https://www.dark-yasiya-api.site/download/tiktok?url=${encodeURIComponent(query)}`;
    const response = await axios.get(apiUrl);

    if (!response.data?.status || !response.data?.result) {
      throw new Error('Invalid API response structure');
    }

    const { title, hdVideo, wmVideo, sound } = response.data.result;

    // Send options to the user
    const optionsMessage = `*Video Found!*\n\n*Title:* ${title}\n\nReply with:\n*1* - HD Video (No Watermark)\n*2* - Watermarked Video\n*3* - Audio (MP3)`;

    await Matrix.sendMessage(m.from, { text: optionsMessage }, { quoted: m });

    // Listen for user reply
    Matrix.on('chat-update', async (chat) => {
      if (!chat.hasNewMessage) return;
      const reply = chat.messages.all()[0];

      if (!reply.key.fromMe && reply.message.extendedTextMessage?.contextInfo?.stanzaId === m.key.id) {
        const userChoice = reply.message.conversation.trim();

        try {
          if (userChoice === '1') {
            // Send HD Video
            await Matrix.sendMedia(m.from, hdVideo, 'mp4', `*${title}*`, reply);
          } else if (userChoice === '2') {
            // Send Watermarked Video
            await Matrix.sendMedia(m.from, wmVideo, 'mp4', `*${title}*`, reply);
          } else if (userChoice === '3') {
            // Send Audio
            await Matrix.sendMedia(m.from, sound, 'mp3', `*Audio from: ${title}*`, reply);
          } else {
            await Matrix.sendMessage(m.from, { text: 'Invalid option. Please reply with 1, 2, or 3.' }, { quoted: reply });
          }
        } catch (err) {
          console.error('Error sending selected media:', err.message);
          await Matrix.sendMessage(m.from, { text: 'Failed to send the selected file. Please try again.' }, { quoted: reply });
        }
      }
    });
  } catch (error) {
    console.error('Error fetching TikTok video:', error.message);
    await m.reply('An error occurred while processing your request. Please try again later.');
  }
};

export default tiktokDownloader;
