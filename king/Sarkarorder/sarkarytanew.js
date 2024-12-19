import axios from 'axios';
import config from '../../config.cjs';

const ytSearchAndDownload = async (m, gss) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const args = m.body.trim().split(' ').slice(1); // Extract search query
  const query = args.join(' ');

  // If no query provided
  if (!query) {
    await gss.sendMessage(
      m.from,
      {
        text: `⚠️ *Usage:* ${prefix}yta <query>\n\nExample: ${prefix}yta tu hai kahan\n\n*Powered By Bandaheali*`,
      },
      { quoted: m }
    );
    return;
  }

  if (cmd === 'yta') {
    try {
      // Step 1: Notify user that the process is starting
      await gss.sendMessage(
        m.from,
        { text: `🔍 *Searching for:* ${query}\nPlease wait while I fetch the audio...` },
        { quoted: m }
      );

      // Step 2: Search YouTube using the query
      const youtubeSearchUrl = `https://api.giftedtech.my.id/api/search/yts?apikey=gifted&query=${encodeURIComponent(query)}`;
      const youtubeSearchResponse = await axios.get(youtubeSearchUrl);

      if (youtubeSearchResponse.data.success && youtubeSearchResponse.data.results.length > 0) {
        const video = youtubeSearchResponse.data.results[0];
        const videoUrl = video.url;  // YouTube video URL

        // Step 3: Download the audio of the video using the 'yta' download API
        const audioDownloadUrl = `https://api.giftedtech.my.id/api/download/ytaud?apikey=gifted&url=${encodeURIComponent(videoUrl)}`;
        const audioDownloadResponse = await axios.get(audioDownloadUrl);

        if (audioDownloadResponse.data.success && audioDownloadResponse.data.result) {
          const audioUrl = audioDownloadResponse.data.result.download_url;  // Audio download URL

          // Step 4: Send the audio to the user
          await gss.sendMessage(
            m.from,
            {
              audio: { url: audioUrl },
              mimetype: 'audio/mp3',  // Explicitly specify audio format
              caption: `🎶 *Here is your audio: ${video.title}*\n*Powered By Bandaheali*`,
            },
            { quoted: m }
          );
        } else {
          throw new Error('Audio download failed! Please try again later.');
        }
      } else {
        throw new Error('No results found for your query.');
      }
    } catch (error) {
      // Handle errors and send a message to the user
      console.error('Error:', error);  // Log error
      await gss.sendMessage(
        m.from,
        {
          text: `❌ *Error:* ${error.message}\n\n*Powered By Bandaheali*`,
        },
        { quoted: m }
      );
    }
  }
};

export default ytSearchAndDownload;

// Sarkar-MD
// Powered By Bandaheali
