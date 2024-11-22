import axios from 'axios';

const getStreamBuffer = async (url) => {
  try {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    if (!response.headers['content-type'].includes('video')) {
      throw new Error('URL does not contain a video stream.');
    }
    return Buffer.from(response.data);
  } catch (error) {
    console.error("Error fetching video:", error);
    throw new Error('Error downloading video.');
  }
};

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
      await m.React("🔄 Downloading...");

      const fbData = await getFBInfo(text);
      console.log("fbData:", fbData);

      if (!fbData) {
        await m.reply('No results found.');
        await m.React("❌");
        return;
      }

      const videoUrl = fbData.sd || fbData.hd; // SD preferred for faster downloads
      if (!videoUrl) {
        await m.reply('No video found in supported quality.');
        await m.React("❌");
        return;
      }

      const videoBuffer = await getStreamBuffer(videoUrl);
      const fileSizeInMB = videoBuffer.length / (1024 * 1024);

      if (fileSizeInMB <= 300) {
        const content = { 
          video: videoBuffer, 
          mimetype: 'video/mp4', 
          caption: '> © DOWNLOADED BY SARKAR-MD',
        };
        await Matrix.sendMessage(m.from, content, { quoted: m });
        await m.React("✅");
      } else {
        await m.reply('The video file size exceeds 300MB.');
        await m.React("❌");
      }
    } catch (error) {
      console.error("Error processing your request:", error);
      await m.reply('Error processing your request.');
      await m.React("❌");
    }
  }
};
export default facebookCommand;
