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

    // Construct buttons for user selection
    const buttons = [
      { buttonId: `${prefix}tt2-hd-${query}`, buttonText: { displayText: 'HD Video (No Watermark)' }, type: 1 },
      { buttonId: `${prefix}tt2-wm-${query}`, buttonText: { displayText: 'Watermarked Video' }, type: 1 },
      { buttonId: `${prefix}tt2-audio-${query}`, buttonText: { displayText: 'Audio (MP3)' }, type: 1 },
    ];

    const buttonMessage = {
      text: `*Video Found!*\n\n*Title:* ${title}\n\nSelect an option:`,
      footer: '© Powered by Sarkar-MD',
      buttons: buttons,
      headerType: 1,
    };

    await Matrix.sendMessage(m.from, buttonMessage, { quoted: m });

    // Listen for button responses
    Matrix.on('chat-update', async (chat) => {
      if (!chat.hasNewMessage) return;
      const reply = chat.messages.all()[0];
      if (!reply.message.buttonsResponseMessage) return;

      const buttonId = reply.message.buttonsResponseMessage.selectedButtonId;

      try {
        if (buttonId.startsWith(`${prefix}tt2-hd`)) {
          // Send HD Video
          await Matrix.sendMedia(m.from, hdVideo, 'mp4', `*${title}*`, m);
        } else if (buttonId.startsWith(`${prefix}tt2-wm`)) {
          // Send Watermarked Video
          await Matrix.sendMedia(m.from, wmVideo, 'mp4', `*${title}*`, m);
        } else if (buttonId.startsWith(`${prefix}tt2-audio`)) {
          // Send Audio
          await Matrix.sendMedia(m.from, sound, 'mp3', `*Audio from: ${title}*`, m);
        }
      } catch (err) {
        console.error('Error sending selected media:', err.message);
        await Matrix.sendMessage(m.from, { text: 'Failed to send the selected file. Please try again.' }, { quoted: m });
      }
    });
  } catch (error) {
    console.error('Error fetching TikTok video:', error.message);
    await m.reply('An error occurred while processing your request. Please try again later.');
  }
};

export default tiktokDownloader;
