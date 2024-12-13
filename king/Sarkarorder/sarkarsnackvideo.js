import axios from 'axios';
import config from '../../config.cjs';

const snackVideoDownloader = async (message, client) => {
  const prefix = config.PREFIX; // Bot prefix from configuration
  const command = message.body.startsWith(prefix)
    ? message.body.slice(prefix.length).split(" ")[0].toLowerCase()
    : '';
  let args = message.body.slice(prefix.length + command.length).trim();

  const validCommands = ["snack", "snackvideo", "svdl"];
  if (validCommands.includes(command)) {
    if (!args) {
      return client.sendMessage(message.from, {
        text: `Please provide a Snack Video URL. Example usage: ${prefix}${command} <Snack Video URL>`
      });
    }

    // Validate Snack Video URL
    if (!/^https?:\/\/(www\.)?snackvideo\.com\/.*$/.test(args)) {
      return client.sendMessage(message.from, {
        text: "Invalid Snack Video URL. Please provide a valid Snack Video link."
      });
    }

    try {
      // Inform the user that the bot is processing
      await client.sendMessage(message.from, { text: "*SNACKVIDEO is downloading, please wait...*" });

      // Fetch the video from the API
      const apiEndpoint = `https://api.siputzx.my.id/api/d/snackvideo?url=${encodeURIComponent(args)}`;
      const response = await axios.get(apiEndpoint);

      if (response.status === 200 && response.data?.status) {
        const videoData = response.data.data?.[0]; // Extract the first video object
        if (videoData?.url) {
          // Send the video back to the user
          await client.sendMessage(message.from, {
            video: { url: videoData.url },
            caption: "*DOWNLOADED BY Sarkar-MD*"
          });
        } else {
          throw new Error("Video URL not found in API response.");
        }
      } else {
        throw new Error(response.data?.message || "API returned an error.");
      }
    } catch (error) {
      console.error("Error downloading Snack Video:", error);
      await client.sendMessage(message.from, {
        text: "*Oops! Something went wrong while downloading the video. Please try again later.*"
      });
    }
  }
};

export default snackVideoDownloader;
