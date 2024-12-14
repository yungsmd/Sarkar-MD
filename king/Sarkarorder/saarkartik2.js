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

    const { title, hdVideo, wmVideo } = response.data.result;

    // Ask the user for their preference
    const choiceMessage = `*Video Found!*\n\n*Title:* ${title}\n\nReply with:\n1️⃣ for HD Video (No Watermark)\n2️⃣ for Watermarked Video`;

    await Matrix.sendMessage(m.from, { text: choiceMessage }, { quoted: m });

    // Wait for user reply
    Matrix.on('chat-update', async (chat) => {
      if (!chat.hasNewMessage || !chat.messages.all()[0].key.fromMe) {
        const reply = chat.messages.all()[0];
        const choice = reply.message.conversation;

        if (choice === '1') {
          // Send HD Video
          await Matrix.sendMedia(m.from, hdVideo, 'mp4', `*${title}*`, m);
        } else if (choice === '2') {
          // Send Watermarked Video
          await Matrix.sendMedia(m.from, wmVideo, 'mp4', `*${title}*`, m);
        } else {
          await Matrix.sendMessage(m.from, { text: 'Invalid choice. Please reply with 1 or 2.' }, { quoted: m });
        }
      }
    });
  } catch (error) {
    console.error('Error fetching TikTok video:', error.message);
    await m.reply('An error occurred while processing your request. Please try again later.');
  }
};

export default tiktokDownloader;
