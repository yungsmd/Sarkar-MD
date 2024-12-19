import axios from 'axios';
import config from '../../config.cjs';

const ytSearchAndAudioDownload = async (m, gss) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const args = m.body.trim().split(' ').slice(1); // Extract search query
  const query = args.join(' ');

  if (cmd === 'yta' && query) {
    try {
      // Step 1: Search YouTube using the query
      const youtubeSearchUrl = `https://api.giftedtech.my.id/api/search/yts?apikey=gifted&query=${encodeURIComponent(query)}`;
      const youtubeSearchResponse = await axios.get(youtubeSearchUrl);

      if (youtubeSearchResponse.data.success && youtubeSearchResponse.data.results.length > 0) {
        // Extract video details
        const video = youtubeSearchResponse.data.results[0];
        const videoUrl = video.url; // YouTube video URL
        const videoTitle = video.title; // Title of the video

        // Step 2: Download the audio of the video
        const audioDownloadUrl = `https://api.giftedtech.my.id/api/download/ytaud?apikey=gifted&url=${encodeURIComponent(videoUrl)}`;
        const audioDownloadResponse = await axios.get(audioDownloadUrl);

        if (audioDownloadResponse.data.success && audioDownloadResponse.data.result) {
          // Extract audio download link
          const audioUrl = audioDownloadResponse.data.result.download_url;
          const audioTitle = audioDownloadResponse.data.result.title;

          // Send the audio to the user
          await gss.sendMessage(
            m.from,
            {
              audio: { url: audioUrl },
              caption: `🎶 *Audio of* ${videoTitle} 🎶\n\n*Powered By Bandaheali*`,
            },
            { quoted: m }
          );
        } else {
          throw new Error('Audio download failed!');
        }
      } else {
        throw new Error('No results found for your query.');
      }
    } catch (error) {
      // Handle errors (like no results or failed audio download)
      await gss.sendMessage(
        m.from,
        {
          text: `❌ *Error:* ${error.message}\n\n*Powered By Bandaheali*`,
        },
        { quoted: m }
      );
    }
  } else if (cmd === 'ytsearch') {
    await gss.sendMessage(
      m.from,
      {
        text: `⚠️ *Usage:* ${prefix}ytsearch <query>\n\nExample: ${prefix}ytsearch tu hai kahan\n\n*Powered By Bandaheali*`,
      },
      { quoted: m }
    );
  }
};

export default ytSearchAndAudioDownload;

// Sarkar-MD
// Powered By Bandaheali
