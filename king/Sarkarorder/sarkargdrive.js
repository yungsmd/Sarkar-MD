import axios from 'axios';
import config from '../../config.cjs';

const gDriveDownloader = async (message, client) => {
  const prefix = config.PREFIX;
  const command = message.body.startsWith(prefix)
    ? message.body.slice(prefix.length).split(" ")[0].toLowerCase()
    : '';
  const args = message.body.slice(prefix.length + command.length).trim();

  const validCommands = ["gdrive", "gdrivevideo", "gdl"];
  if (validCommands.includes(command)) {
    if (!args) {
      return client.sendMessage(message.from, {
        text: `Please provide a Google Drive URL. Example usage: ${prefix}${command} <Google Drive URL>`
      });
    }

    if (!/^https?:\/\/(www\.)?drive\.google\.com\/.*$/.test(args)) {
      return client.sendMessage(message.from, {
        text: "Invalid Google Drive URL. Please provide a valid Google Drive link."
      });
    }

    try {
      await client.sendMessage(message.from, { text: "*Fetching the file, please wait...*" });

      const apiEndpoint = `https://api.siputzx.my.id/api/d/gdrive?url=${encodeURIComponent(args)}`;
      console.log("Fetching URL:", apiEndpoint); // Debug log

      const response = await axios.get(apiEndpoint);
      console.log("API Response:", response.data); // Debug log

      if (response.status === 200 && response.data?.status) {
        const fileData = response.data.data;

        if (fileData?.download) {
          await client.sendMessage(message.from, {
            text: `*File Name:* ${fileData.name}\n*Download Link:* ${fileData.download}\n*View Link:* ${fileData.link}\n\nClick on the download link to get the file!`
          });
        } else {
          throw new Error("Download link not found in API response.");
        }
      } else {
        throw new Error(response.data?.message || "API returned an error.");
      }
    } catch (error) {
      console.error("Error downloading Google Drive file:", error.message || error);
      await client.sendMessage(message.from, {
        text: "*Oops! Something went wrong while downloading the file. Please try again later.*"
      });
    }
  }
};

export default gDriveDownloader;
