import axios from "axios";
import { createRequire } from "module";
import fs from "fs";
import path from "path";
import { createWriteStream } from "fs";

// Import config.cjs using createRequire
const require = createRequire(import.meta.url);
const config = require("../../config.cjs");

const gitCloneCommand = async (m, gss) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(" ")[0].toLowerCase() : "";
  const validCommands = ["gitclone", "gitdownload"];

  if (validCommands.includes(cmd)) {
    // Extract the GitHub repository URL from the command (e.g., "!gitclone <url>")
    const repoUrl = m.body.split(" ")[1];

    if (!repoUrl) {
      await gss.sendMessage(
        m.from,
        { text: "❌ Please provide a valid GitHub repository URL after the command." },
        { quoted: m }
      );
      return;
    }

    const apiUrl = `https://api.giftedtech.my.id/api/download/gitclone?apikey=gifted&url=${encodeURIComponent(repoUrl)}`;

    try {
      // Fetch data from API
      const response = await axios.get(apiUrl);
      const apiData = response.data;

      if (apiData.status === 200 && apiData.success) {
        const result = apiData.result;

        // Download the zip file using the download_url
        const downloadUrl = result.download_url;
        const filePath = path.join(__dirname, `${result.name}.zip`);
        
        // Create a write stream to save the file locally
        const writer = createWriteStream(filePath);

        // Fetch and pipe the file content to the write stream
        const downloadResponse = await axios.get(downloadUrl, { responseType: "stream" });
        downloadResponse.data.pipe(writer);

        writer.on("finish", async () => {
          // Send the zip file to the user after it's fully downloaded
          await gss.sendMessage(
            m.from,
            {
              document: { url: filePath }, // Path to the downloaded file
              fileName: `${result.name}.zip`, // Name of the file
              mimetype: "application/zip", // Mimetype for zip files
              caption: `*📦 Repository Name*: ${result.name}\n*🔗 Downloaded Repo:* ${downloadUrl}\n\nEnjoy downloading the repository!`,
            },
            { quoted: m }
          );
          // Clean up the downloaded file (optional)
          fs.unlinkSync(filePath);
        });

        writer.on("error", async (err) => {
          console.error("Error downloading the file:", err);
          await gss.sendMessage(
            m.from,
            { text: "❌ Failed to download the repository. Please try again later." },
            { quoted: m }
          );
        });
      } else {
        await gss.sendMessage(
          m.from,
          { text: "❌ Failed to fetch repository details. Please check the URL or try again later." },
          { quoted: m }
        );
      }
    } catch (error) {
      console.error("GitClone Command Error:", error);
      await gss.sendMessage(
        m.from,
        { text: "❌ An error occurred while processing the GitClone command. Please try again later." },
        { quoted: m }
      );
    }
  }
};

export default gitCloneCommand;

// Sarkar-MD POWERED BY BANDAHEALI
