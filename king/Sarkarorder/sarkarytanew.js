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
        { text: `❌ *Please provide a search query or YouTube video link!*` },
        { quoted: m }
      );
    }

    try {
      let videoUrl = '';

      // Check if the input is a YouTube link
      if (query.startsWith('http') && query.includes('youtube.com')) {
        videoUrl = query;
      } else {
        // Use YTS API for search
        const searchApiURL = `https://www.dark-yasiya-api.site/search/yt?text=${encodeURIComponent(query)}`;
        const searchResponse = await axios.get(searchApiURL);
        const searchData = searchResponse.data;

        console.log('Search API Response:', searchData); // Add this for debugging

        if (searchData.status && searchData.result.data.length > 0) {
          const video = searchData.result.data[0]; // Select the first video result
          videoUrl = video.url;

          // Inform user about the selected video
          const searchMessage = `🎥 *${video.title}*\n\n⏱ *Duration:* ${video.duration.timestamp}\n👀 *Views:* ${video.views}\n📝 *Author:* ${video.author.name}\n\n📥 *Fetching audio...*`;
          await gss.sendMessage(m.from, { text: searchMessage }, { quoted: m });
        } else {
          return await gss.sendMessage(
            m.from,
            { text: `❌ *No results found for "${query}".*` },
            { quoted: m }
          );
        }
      }

      // Use new BK9 API for downloading audio
      const downloadApiURL = `https://bk9.fun/download/ytmp3?url=${encodeURIComponent(videoUrl)}`;
      const downloadResponse = await axios.get(downloadApiURL);
      const downloadData = downloadResponse.data;

      console.log('Download API Response:', downloadData); // Add this for debugging

      if (downloadData.status) {
        const result = downloadData.BK9; // Get the BK9 data from the response

        const message = `🎵 *Downloadable Audio*\n\n📥 *Download MP3:* [Click Here](${result.downloadUrl})`;

        await gss.sendMessage(
          m.from,
          {
            text: message,
          },
          { quoted: m }
        );
      } else {
        await gss.sendMessage(
          m.from,
          { text: `❌ *Failed to fetch MP3 download link. Please check the video URL.*` },
          { quoted: m }
        );
      }
    } catch (error) {
      console.error('Error fetching data:', error); // Log the error for debugging
      await gss.sendMessage(
        m.from,
        { text: `❌ *An error occurred while processing your request. Please try again later.*` },
        { quoted: m }
      );
    }
  }
};

export default ytaCommand;
// POWERED BY BANDAHEALI
