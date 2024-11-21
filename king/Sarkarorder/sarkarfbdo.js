import pkg, { prepareWAMessageMedia } from '@whiskeysockets/baileys';
const { generateWAMessageFromContent, proto } = pkg;
import getFBInfo from '@xaviabot/fb-downloader';
import config from '../../config.cjs';

const facebookCommand = async (m, Matrix) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const text = m.body.slice(prefix.length + cmd.length).trim();

  const validCommands = ['facebook', 'fb', 'fbdl'];

  if (validCommands.includes(cmd)) {
    if (!text) {
      return m.reply('Please provide a Facebook video URL.');
    }

    try {
      await m.React("🕘");

      const fbData = await getFBInfo(text);
      console.log("fbData:", fbData);  // Log the data structure

      if (!fbData) {
        await m.reply('No results found.');
        await m.React("❌");
        return;
      }

      // Choose the highest available quality
      const videoUrl = fbData.hd || fbData.sd; // Prefer HD, fallback to SD
      if (!videoUrl) {
        await m.reply('No video found in supported quality.');
        await m.React("❌");
        return;
      }

      // Fetch and send the video
      const videoBuffer = await getStreamBuffer(videoUrl);
      const fileSizeInMB = videoBuffer.length / (1024 * 1024);

      if (fileSizeInMB <= 300) {
        const content = { 
          video: videoBuffer, 
          mimetype: 'video/mp4', 
          caption: '> © POWERED BY SARKAR-MD',
        };
        await Matrix.sendMessage(m.from, content, { quoted: m });
      } else {
        await m.reply('The video file size exceeds 300MB.');
      }

      await m.React("✅");

    } catch (error) {
      console.error("Error processing your request:", error);
      await m.reply('Error processing your request.');
      await m.React("❌");
    }
  }
};

const getStreamBuffer = async (url) => {
  const response = await fetch(url);
  const buffer = await response.arrayBuffer();
  return Buffer.from(buffer);
};

export default facebookCommand;
