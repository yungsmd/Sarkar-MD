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
      const youtubeSearchUrl = `https://www.dark-yasiya-api.site/search/yt?text=${encodeURIComponent(query)}`;
      const youtubeSearchResponse = await axios.get(youtubeSearchUrl);

      if (youtubeSearchResponse.data.status && youtubeSearchResponse.data.result.data.length > 0) {
        // Extract video details
        const video = youtubeSearchResponse.data.result.data[0];
        const videoUrl = video.url; // YouTube video URL
        const videoTitle = video.url.split('=')[1]; // Extract video ID from URL

        // Step 2: Get the audio download link using the ytmp3 API
        const audioDownloadUrl = `https://www.dark-yasiya-api.site/download/ytmp3?url=${encodeURIComponent(videoUrl)}`;
        const audioDownloadResponse = await axios.get(audioDownloadUrl);

        if (audioDownloadResponse.data.status && audioDownloadResponse.data.result) {
          // Extract the download link and audio title
          const audioUrl = audioDownloadResponse.data.result.dl_link; // The download URL
          const audioTitle = audioDownloadResponse.data.result.title; // Title of the audio

          // Send the audio to the user as an MP3 file
          await gss.sendMessage(
            m.from,
            {
              audio: { url: audioUrl },
              mimetype: 'audio/mp3', // Ensure it's sent as an MP3 file
              caption: `🎶 *Audio of* ${audioTitle} 🎶\n\n*Powered By Bandaheali*`,
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
  } else if (cmd === 'yta') {
    await gss.sendMessage(
      m.from,
      {
        text: `⚠️ *Usage:* ${prefix}yta <query>\n\nExample: ${prefix}yta tu hai kahan\n\n*Powered By Bandaheali*`,
      },
      { quoted: m }
    );
  }
};

export default ytSearchAndAudioDownload;

// Sarkar-MD
// Powered By Bandaheali
