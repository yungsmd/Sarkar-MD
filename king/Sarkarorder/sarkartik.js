import fetch from 'node-fetch';
import config from '../../config.cjs'; // Ensure config.cjs has your bot settings

const downloadTikTokVideo = async (m, gss) => {
  const prefix = config.PREFIX; // Get prefix from config.cjs
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const args = m.body.slice(prefix.length + cmd.length).trim().split(' ');
  const url = args[0]; // TikTok video URL
  const caption = args.slice(1).join(' '); // Caption text after URL

  // Allowed TikTok download commands
  const validCommands = ['tiktokdl', 'tt', 'tiktok'];
  if (validCommands.includes(cmd)) {
    if (!url) {
      return m.reply('Please provide a TikTok video URL.');
    }

    // API endpoint
    const apiUrl = `https://api.nexoracle.com/downloader/tiktok-nowm?apikey=sarkar_786&url=${encodeURIComponent(url)}`;

    try {
      // Fetch request to the TikTok downloader API
      const response = await fetch(apiUrl);

      // Check if the response is not okay (any status other than 200)
      if (!response.ok) {
        const errorText = await response.text(); // Get the error text from the response
        console.error(`API Error: Status Code ${response.status}, Response Text: ${errorText}`);
        throw new Error(`API Error ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log('API response data:', data);

      // Extract the video URL based on the response format
      const videoUrl = data?.videoUrl || data?.result?.url || data?.data?.video || null;
      if (!videoUrl) throw new Error('Video URL not found in API response.');

      // Send video with caption
      await gss.sendMessage(m.from, { video: { url: videoUrl }, caption });

      // Delete the original command message after sending the video (for Baileys)
      await gss.sendMessage(m.key.remoteJid, { delete: m.key });
    } catch (error) {
      console.error('Error downloading TikTok video:', error.message);
      m.reply(`Failed to download TikTok video. Error: ${error.message}. Please try again later.`);
    }
  }
};

export default downloadTikTokVideo;
