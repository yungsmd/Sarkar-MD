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

    // Define a function to handle the user response
    const handleUserResponse = async (response) => {
      const userChoice = response.body.trim();
      let mediaUrl = '';
      let mediaType = '';
      let caption = `*${title}*`;

      if (userChoice === '1') {
        mediaUrl = hdVideo;
        mediaType = 'mp4';
        caption += ' (HD Video)';
      } else if (userChoice === '2') {
        mediaUrl = wmVideo;
        mediaType = 'mp4';
        caption += ' (Watermarked Video)';
      } else if (userChoice === '3') {
        mediaUrl = sound;
        mediaType = 'mp3';
        caption += ' (Audio)';
      } else {
        return Matrix.sendMessage(m.from, { text: 'Invalid option. Please reply with 1, 2, or 3.' }, { quoted: response });
      }

      // Send the selected media to the user
      await Matrix.sendMedia(m.from, mediaUrl, mediaType, caption, response);
    };

    // Set up a listener for the user response to the message
    Matrix.on('message', async (newMessage) => {
      if (newMessage.from === m.from && newMessage.body) {
        await handleUserResponse(newMessage);
      }
    });

  } catch (error) {
    console.error('Error fetching TikTok video:', error.message);
    await m.reply('An error occurred while processing your request. Please try again later.');
  }
};

export default tiktokDownloader;
