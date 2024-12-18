import axios from "axios";
import config from "../../config.js"; // Ensure config is an ES module

const tiktokSearchCommand = async (m, gss) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(" ")[0].toLowerCase() : "";

  if (cmd === "ttsearch") {
    // Extract query from user input
    const query = m.body.split(" ").slice(1).join(" ");

    if (!query) {
      await gss.sendMessage(
        m.from,
        { text: "❌ Please provide a search term after the command. Example: *!ttsearch Tu hai kahan*" },
        { quoted: m }
      );
      return;
    }

    const searchApiUrl = `https://api.siputzx.my.id/api/s/tiktok?query=${encodeURIComponent(query)}`;
    const errorMessage = "❌ Failed to fetch TikTok search results. Please try again later.";

    try {
      // Fetch search results from the API
      const response = await axios.get(searchApiUrl);

      if (!response || response.status !== 200 || !response.data.status) {
        await gss.sendMessage(
          m.from,
          { text: errorMessage },
          { quoted: m }
        );
        return;
      }

      const results = response.data.data;

      if (results.length === 0) {
        await gss.sendMessage(
          m.from,
          { text: `❌ No results found for "${query}".` },
          { quoted: m }
        );
        return;
      }

      // Iterate over results and send each result to the user
      for (const result of results) {
        const message = {
          image: { url: result.cover },
          caption: `🎥 *TikTok Video Search Result* 🎥\n\n` +
            `*Title:* ${result.title}\n` +
            `*Duration:* ${result.duration} seconds\n` +
            `*Play Count:* ${result.play_count}\n` +
            `*Likes:* ${result.digg_count}\n` +
            `*Comments:* ${result.comment_count}\n` +
            `*Shares:* ${result.share_count}\n` +
            `*Music:* ${result.music_info.title} by ${result.music_info.author}\n\n` +
            `*Author:* ${result.author.nickname} (@${result.author.unique_id})\n` +
            `*Region:* ${result.region}\n\n` +
            `🔗 *Watch Video:* ${result.play}\n\n` +
            `_Sarkar-MD by Bandaheali_`,
        };

        await gss.sendMessage(m.from, message, { quoted: m });
      }
    } catch (error) {
      console.error("TikTok Search Command Error:", error.message || error);

      await gss.sendMessage(
        m.from,
        { text: errorMessage },
        { quoted: m }
      );
    }
  }
};

export default tiktokSearchCommand;

// Sarkar-MD TikTok Search Command POWERED BY BANDAHEALI
