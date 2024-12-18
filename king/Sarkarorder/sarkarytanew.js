import axios from "axios";
import config from "../../config.js"; // Ensure config is an ES module

const ytAudioDownloadCommand = async (m, gss) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(" ")[0].toLowerCase() : "";

  if (cmd === "yta") {
    // Extract query from user input
    const query = m.body.split(" ").slice(1).join(" ");

    if (!query) {
      await gss.sendMessage(
        m.from,
        { text: "❌ Please provide a search term after the command. Example: *!ytaudio Spectre*" },
        { quoted: m }
      );
      return;
    }

    const searchApiUrl = `https://api.giftedtech.my.id/api/search/yts?apikey=gifted&query=${encodeURIComponent(query)}`;
    const downloadApiUrl = "https://api.giftedtech.my.id/api/download/ytaudio?apikey=gifted&url=";

    const errorMessage = "❌ Failed to fetch video or audio. Please try again later.";

    try {
      // Fetch search results from the API
      const searchResponse = await axios.get(searchApiUrl);

      if (!searchResponse || searchResponse.status !== 200 || !searchResponse.data.success) {
        await gss.sendMessage(
          m.from,
          { text: errorMessage },
          { quoted: m }
        );
        return;
      }

      const video = searchResponse.data.results[0]; // Assuming the first result is the desired one

      if (!video) {
        await gss.sendMessage(
          m.from,
          { text: `❌ No audio found for "${query}".` },
          { quoted: m }
        );
        return;
      }

      // Display video details to the user
      const message = {
        image: { url: video.image },
        caption: `🎬 *Audio Found* 🎬\n\n` +
          `*Title:* ${video.title}\n` +
          `*Description:* ${video.description}\n` +
          `*Duration:* ${video.duration.timestamp}\n` +
          `*Views:* ${video.views}\n` +
          `*Author:* [${video.author.name}](${video.author.url})\n\n` +
          `🔗 *Watch Video:* ${video.url}\n\n` +
          `_Sarkar-MD by Bandaheali_`,
      };

      await gss.sendMessage(m.from, message, { quoted: m });

      // Fetch the audio download link using the video URL
      const downloadResponse = await axios.get(`${downloadApiUrl}${encodeURIComponent(video.url)}`);

      if (!downloadResponse || downloadResponse.status !== 200 || !downloadResponse.data.success) {
        await gss.sendMessage(
          m.from,
          { text: errorMessage },
          { quoted: m }
        );
        return;
      }

      const downloadUrl = downloadResponse.data.result.download_url;
      const audioTitle = downloadResponse.data.result.title;

      // Send the audio file to the user
      await gss.sendMessage(
        m.from,
        { audio: { url: downloadUrl }, mimetype: "audio/mp4", caption: `🎵 *${audioTitle}*` },
        { quoted: m }
      );
    } catch (error) {
      console.error("YouTube Audio Download Command Error:", error.message || error);

      await gss.sendMessage(
        m.from,
        { text: errorMessage },
        { quoted: m }
      );
    }
  }
};

export default ytAudioDownloadCommand;

// Sarkar-MD YouTube Audio Download Command POWERED BY BANDAHEALI
