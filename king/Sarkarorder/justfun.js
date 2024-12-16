import axios from "axios";
import { createRequire } from "module";

// Import config.cjs using createRequire
const require = createRequire(import.meta.url);
const config = require("../../config.cjs");

const henatiCommand = async (m, gss) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(" ")[0].toLowerCase() : "";
  const validCommands = ["henati", "hentai"];

  if (validCommands.includes(cmd)) {
    const apiUrl = "https://www.dark-yasiya-api.site/download/henati";

    try {
      // Fetch data from API
      const response = await axios.get(apiUrl);
      const apiData = response.data;

      if (apiData.status && apiData.result?.data?.length > 0) {
        const items = apiData.result.data;

        // Loop through the first 2 videos and send them to the user
        for (let i = 0; i < Math.min(2, items.length); i++) {
          const video = items[i];

          await gss.sendMessage(
            m.from,
            {
              video: { url: video.video_1 }, // Video URL to send
              caption: `*${video.title}*\n\nCategory: ${video.category}\nViews: ${video.views_count}\n🔗 [More Info](${video.url})\n\n😎 POWERED BY BANDAHEALI`,
            },
            { quoted: m }
          );
        }
      } else {
        await gss.sendMessage(
          m.from,
          { text: "No results found or invalid response from the API. 😞" },
          { quoted: m }
        );
      }
    } catch (error) {
      console.error("Henati Command Error:", error);
      await gss.sendMessage(
        m.from,
        { text: "An error occurred while fetching Henati data. Please try again later. 😞" },
        { quoted: m }
      );
    }
  }
};

export default henatiCommand;

// POWERED BY BANDAHEALI
