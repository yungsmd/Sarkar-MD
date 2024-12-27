// Sarkar-MD
import axios from 'axios';
import config from '../../config.cjs';

const youtubeVideo = async (m, gss) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const validCommands = ['ytvid', 'yvid', 'youtubevideo'];

  if (validCommands.includes(cmd)) {
    const query = m.body.slice(prefix.length + cmd.length).trim();
    if (!query) {
      return await gss.sendMessage(m.from, { text: 'Please provide a YouTube video link or video name.' }, { quoted: m });
    }

    try {
      await gss.sendMessage(m.from, { text: 'Fetching your video, please wait...' }, { quoted: m }); // Loading message
      const response = await axios.get(`https://api.some-youtube-api.com/getVideo?query=${encodeURIComponent(query)}`);
      
      // Validate response structure
      const videoUrl = response.data?.videoUrl;
      if (videoUrl) {
        await gss.sendMessage(
          m.from,
          {
            video: { url: videoUrl },
            caption: `🎬 *YouTube Video* 🎬\n\n🎥 Video fetched by BANDAHEALI 🎥`,
          },
          { quoted: m }
        );
      } else {
        await gss.sendMessage(m.from, { text: 'Sorry, no video found for that query.' }, { quoted: m });
      }
    } catch (error) {
      console.error(error); // Log error for debugging
      await gss.sendMessage(m.from, { text: 'Failed to fetch the video. Please try again later.' }, { quoted: m });
    }
  }
};

export default youtubeVideo;
// POWERED BY BANDAHEALI
