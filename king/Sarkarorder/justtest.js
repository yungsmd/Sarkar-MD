import axios from 'axios';
import config from '../../config.cjs';

const youtubeSearchCommand = async (message, client) => {
  const prefix = config.PREFIX;
  const command = message.body.startsWith(prefix)
    ? message.body.slice(prefix.length).split(" ")[0].toLowerCase()
    : '';
  const searchQuery = message.body.slice(prefix.length + command.length).trim();

  const validCommands = ["youtube", "yt"];
  if (validCommands.includes(command)) {
    if (!searchQuery) {
      return client.sendMessage(message.from, {
        text: `Please provide a search term. Example usage: ${prefix}${command} <search term>`
      });
    }

    try {
      await client.sendMessage(message.from, { text: "*Searching for videos, please wait...*" });

      // Construct the API search query endpoint
      const apiEndpoint = `https://api.siputzx.my.id/api/d/youtube?q=${encodeURIComponent(searchQuery)}`;
      console.log("Searching with URL:", apiEndpoint); // Debug log

      const response = await axios.get(apiEndpoint);
      console.log("API Response:", response.data); // Debug log

      if (response.status === 200 && response.data?.status) {
        const videoData = response.data.data;

        // Check if video and audio are available, use the first one
        const downloadOption = videoData.video ? "video" : "audio";
        let downloadLink = downloadOption === "video" ? videoData.video : videoData.sounds;

        const messageText = `
        *Title:* ${videoData.title}
        *Duration:* ${videoData.duration}
        
        *Download ${downloadOption.charAt(0).toUpperCase() + downloadOption.slice(1)}:*
        [Click to Download](${downloadLink})

        *Thumbnail:* ${videoData.thumbnailUrl}
        `;

        await client.sendMessage(message.from, { text: messageText });

        // Optionally, you can send the thumbnail image
        await client.sendMessage(message.from, {
          image: { url: videoData.thumbnailUrl },
          caption: "Video Thumbnail",
        });

      } else {
        throw new Error("API returned an error.");
      }
    } catch (error) {
      console.error("Error fetching YouTube search result:", error.message || error);
      await client.sendMessage(message.from, {
        text: "*Oops! Something went wrong while searching the video. Please try again later.*"
      });
    }
  }
};

export default youtubeSearchCommand;
