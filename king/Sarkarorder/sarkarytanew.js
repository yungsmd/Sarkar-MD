import axios from "axios";
import config from "../../config.js"; // Ensure your config file exports as ES module

const ytaAndSongCommand = async (m, gss) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(" ")[0].toLowerCase() : "";
  const validCommands = ["yta", "song"];

  if (validCommands.includes(cmd)) {
    // Extract the search query from the message (e.g., "!yta <query>")
    const query = m.body.split(" ").slice(1).join(" ");

    if (!query) {
      await gss.sendMessage(
        m.from,
        { text: "❌ Please provide a valid search query after the command." },
        { quoted: m }
      );
      return;
    }

    const searchApiUrl = `https://www.dark-yasiya-api.site/youtube/search?query=${encodeURIComponent(query)}`;
    try {
      // Step 1: Fetch search results from the YouTube Search API
      const searchResponse = await axios.get(searchApiUrl);
      const searchData = searchResponse.data;

      if (!searchData.status || searchData.result.length === 0) {
        await gss.sendMessage(
          m.from,
          { text: "❌ No results found for your query. Please try with a different keyword." },
          { quoted: m }
        );
        return;
      }

      // Select the first result
      const video = searchData.result[0];

      // Step 2: Fetch audio download link using YouTube Audio Download API
      const downloadApiUrl = `https://www.dark-yasiya-api.site/youtube/audio?id=${encodeURIComponent(video.videoId)}`;
      const downloadResponse = await axios.get(downloadApiUrl);
      const downloadData = downloadResponse.data;

      if (downloadData.status && downloadData.result) {
        const audio = downloadData.result;

        // Send the song/audio file to the user
        await gss.sendMessage(
          m.from,
          {
            text: `*🎵 Title*: ${video.title}\n*🎤 Channel*: ${video.channel}\n*⏳ Duration*: ${video.duration}\n\n🔗 [Audio Download Link](${audio.audio_url})\n\n🕹️ Enjoy!`,
          },
          { quoted: m }
        );
      } else {
        await gss.sendMessage(
          m.from,
          { text: "❌ Failed to fetch the audio. Please try again later." },
          { quoted: m }
        );
      }
    } catch (error) {
      console.error("YTA & Song Command Error:", error);
      await gss.sendMessage(
        m.from,
        { text: "❌ An error occurred while processing your request. Please try again later." },
        { quoted: m }
      );
    }
  }
};

export default ytaAndSongCommand;

// Sarkar-MD YouTube Audio Command POWERED BY BANDAHEALI
