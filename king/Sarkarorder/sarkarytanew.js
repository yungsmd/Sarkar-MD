import axios from "axios";
import config from "../../config.js"; // Make sure config is ES module

const ytaAndSongCommand = async (m, gss) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(" ")[0].toLowerCase() : "";
  const validCommands = ["yta", "song"];

  if (validCommands.includes(cmd)) {
    // Extract search query
    const query = m.body.split(" ").slice(1).join(" ");

    if (!query) {
      await gss.sendMessage(
        m.from,
        { text: "❌ Please provide a valid search query after the command." },
        { quoted: m }
      );
      return;
    }

    // API URLs
    const searchApiUrl = `https://www.dark-yasiya-api.site/youtube/search?query=${encodeURIComponent(query)}`;
    const errorMessage = "❌ Failed to process your request. Please try again later.";

    try {
      // Step 1: Fetch search results
      const searchResponse = await axios.get(searchApiUrl);

      if (!searchResponse.data || !searchResponse.data.result || searchResponse.data.result.length === 0) {
        await gss.sendMessage(
          m.from,
          { text: "❌ No results found for your query. Please try with a different keyword." },
          { quoted: m }
        );
        return;
      }

      const video = searchResponse.data.result[0]; // First result

      // Step 2: Fetch audio download link
      const downloadApiUrl = `https://www.dark-yasiya-api.site/youtube/audio?id=${encodeURIComponent(video.videoId)}`;
      const downloadResponse = await axios.get(downloadApiUrl);

      if (!downloadResponse.data || !downloadResponse.data.result) {
        await gss.sendMessage(
          m.from,
          { text: "❌ Unable to fetch audio download link. Please try again later." },
          { quoted: m }
        );
        return;
      }

      const audio = downloadResponse.data.result;

      // Step 3: Send details to user
      await gss.sendMessage(
        m.from,
        {
          text: `*🎵 Title*: ${video.title}\n*🎤 Channel*: ${video.channel}\n*⏳ Duration*: ${video.duration}\n\n🔗 [Audio Download Link](${audio.audio_url})\n\n🕹️ Enjoy!`,
        },
        { quoted: m }
      );
    } catch (error) {
      console.error("YTA & Song Command Error:", error.message || error);
      await gss.sendMessage(
        m.from,
        { text: errorMessage },
        { quoted: m }
      );
    }
  }
};

export default ytaAndSongCommand;

// Sarkar-MD YouTube Audio Command POWERED BY BANDAHEALI
