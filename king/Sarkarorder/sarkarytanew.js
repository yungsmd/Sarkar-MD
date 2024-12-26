import axios from 'axios';
import config from '../../config.cjs';

const searchAndDownloadVideo = async (m, gss) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const validCommands = ['yta', 'ytvideo', 'ytvid'];

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
        const videos = searchData.results.map((video) => ({
          title: video.title,
          url: video.url,
          description: video.description,
          views: video.views,
          author: video.author.name,
          thumbnail: video.thumbnail,
        }));

        // Step 2: Display search results
        let searchMessage = `Search Results for "${searchQuery}":\n\n`;
        videos.forEach((video, idx) => {
          searchMessage += `${idx + 1}. Title: ${video.title}\nURL: ${video.url}\nAuthor: ${video.author}\nViews: ${video.views}\nDescription: ${video.description}\n\n`;
        });
        searchMessage += '\nType the number of the video you want to download (e.g., 1, 2, etc.).';

        // Send search results to the user
        await gss.sendMessage(m.from, {
          text: searchMessage,
        }, { quoted: m });

        // Wait for the user's input (for now, we'll assume the user selects the first video)
        const selectedVideoIndex = 0; // Replace this with user input logic
        const selectedVideo = videos[selectedVideoIndex];

        // Step 3: Fetch the download URL for the selected video
        const downloadApiUrl = `https://api.giftedtech.my.id/api/download/yts?apikey=gifted&url=${encodeURIComponent(selectedVideo.url)}`;
        const downloadResponse = await axios.get(downloadApiUrl);
        const downloadData = downloadResponse.data;

        if (downloadData.success) {
          const downloadLink = downloadData.result.download_url;

          // Step 4: Send the video download link to the user
          await gss.sendMessage(
            m.from,
            {
              video: { url: downloadLink },
              caption: `🎬 *Video Downloaded* 🎬\n\nTitle: ${selectedVideo.title}\nDescription: ${selectedVideo.description}\n\nCreated by BANDAHEALI.`,
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

export default searchAndDownloadVideo;
