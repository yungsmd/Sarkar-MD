// Sarkar-MD
import axios from 'axios';
import config from '../../config.cjs';

const ytaCommand = async (m, gss) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const validCommands = ['yta', 'ytdl', 'song'];

  if (validCommands.includes(cmd)) {
    const query = m.body.slice(prefix.length + cmd.length).trim();
    
    if (!query) {
      return await gss.sendMessage(
        m.from,
        { text: `❌ *Please provide a search query!*` },
        { quoted: m }
      );
    }

    try {
      const apiURL = `https://www.dark-yasiya-api.site/search/yt?text=${encodeURIComponent(query)}`;
      const response = await axios.get(apiURL);
      const data = response.data;

      if (data.status && data.result.data.length > 0) {
        const video = data.result.data[0]; // Select the first video result

        await gss.sendMessage(
          m.from,
          {
            video: { url: video.url },
            caption: `🎥 *${video.title}*\n\n⏱ Duration: ${video.duration.timestamp}\n👀 Views: ${video.views}\n📝 Author: ${video.author.name}\n\n📥 *Download it now!*`,
          },
          { quoted: m }
        );
      } else {
        await gss.sendMessage(
          m.from,
          { text: `❌ *No results found for "${query}".*` },
          { quoted: m }
        );
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      await gss.sendMessage(
        m.from,
        { text: `❌ *Failed to fetch YouTube results. Please try again later.*` },
        { quoted: m }
      );
    }
  }
};

export default ytaCommand;
// POWERED BY BANDAHEALI
