// Sarkar-MD
import axios from 'axios';
import fs from 'fs';
import path from 'path';
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

        if (searchData.status && searchData.result.data.length > 0) {
          const video = searchData.result.data[0];
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

      // Use YTMP3 API for downloading audio from the video URL
      const downloadApiURL = `https://www.dark-yasiya-api.site/download/ytmp3?url=${encodeURIComponent(videoUrl)}`;
      const downloadResponse = await axios.get(downloadApiURL);
      const downloadData = downloadResponse.data;

      if (downloadData.status) {
        const result = downloadData.result;
        const audioUrl = result.dl_link;

        // Download MP3 file
        const tempFilePath = path.join(__dirname, `temp_${Date.now()}.mp3`);
        console.log('Saving file to:', tempFilePath);

        const writer = fs.createWriteStream(tempFilePath);

        const audioResponse = await axios({
          url: audioUrl,
          method: 'GET',
          responseType: 'stream',
        });

        audioResponse.data.pipe(writer);

        // Wait for the download to complete
        await new Promise((resolve, reject) => {
          writer.on('finish', resolve);
          writer.on('error', reject);
        });

        // Send the downloaded audio file to the user
        await gss.sendMessage(
          m.from,
          {
            audio: { url: tempFilePath },
            mimetype: 'audio/mp3',
            ptt: false,
          },
          { quoted: m }
        );

        // Delete the temporary file
        fs.unlinkSync(tempFilePath);
      } else {
        await gss.sendMessage(
          m.from,
          { text: `❌ *Failed to fetch MP3 download link. Please check the video URL.*` },
          { quoted: m }
        );
      }
    } catch (error) {
      console.error('Detailed Error:', error.response?.data || error.message);
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
