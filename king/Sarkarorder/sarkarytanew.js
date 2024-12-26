import axios from 'axios';
import config from '../../config.cjs';

const searchAndDownload = async (m, gss) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const validCommands = ['ytsearch', 'ytvideo', 'ytvid'];

  if (validCommands.includes(cmd)) {
    const searchQuery = m.body.slice(prefix.length + cmd.length).trim(); // Get search query from the user
    if (!searchQuery) {
      await gss.sendMessage(m.from, {
        text: 'Please provide a search term to look for a video.',
      }, { quoted: m });
      return;
    }

    const searchApiUrl = `https://api.giftedtech.my.id/api/search/yts?apikey=gifted&query=${encodeURIComponent(searchQuery)}`;

    try {
      await m.React('⏳'); // React with a loading icon

      // Step 1: Fetch search results
      const searchResponse = await axios.get(searchApiUrl);
      const searchData = searchResponse.data;

      if (searchData.success) {
        // Get the first video from the search results
        const firstVideo = searchData.results[0];
        const videoUrl = firstVideo.url;

        // Step 2: Fetch the download link for the first video
        const downloadApiUrl = `https://api.giftedtech.my.id/api/download/yts?apikey=gifted&url=${encodeURIComponent(videoUrl)}`;
        const downloadResponse = await axios.get(downloadApiUrl);
        const downloadData = downloadResponse.data;

        if (downloadData.success) {
          // Check if the user wants video or audio
          const isAudio = m.body.toLowerCase().includes('audio');
          const downloadLink = downloadData.result[isAudio ? 'audio_url' : 'video_url'];

          // Step 3: Send the video or audio to the user
          await gss.sendMessage(
            m.from,
            {
              [isAudio ? 'audio' : 'video']: { url: downloadLink },
              caption: `🎬 *${isAudio ? 'Audio' : 'Video'} Downloaded* 🎬\n\nTitle: ${firstVideo.title}\nDescription: ${firstVideo.description}\n\nCreated by BANDAHEALI.`,
            },
            { quoted: m }
          );
        } else {
          await gss.sendMessage(m.from, {
            text: 'Sorry, there was an issue fetching the download link.',
          }, { quoted: m });
        }
      } else {
        await gss.sendMessage(m.from, {
          text: 'No results found for your search.',
        }, { quoted: m });
      }
    } catch (error) {
      console.error('Error:', error);
      await gss.sendMessage(m.from, {
        text: 'An error occurred while fetching the data.',
      }, { quoted: m });
    }
  }
};

export default searchAndDownload;
