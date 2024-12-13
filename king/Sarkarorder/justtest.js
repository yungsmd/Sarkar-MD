import axios from 'axios';
import config from '../../config.cjs';

const youtubeCommand = async (message, client) => {
  const prefix = config.PREFIX;
  const command = message.body.startsWith(prefix)
    ? message.body.slice(prefix.length).split(" ")[0].toLowerCase()
    : '';
  const args = message.body.slice(prefix.length + command.length).trim();

  const validCommands = ["play", "yt"];
  if (validCommands.includes(command)) {
    if (!args) {
      return client.sendMessage(message.from, {
        text: `Please provide a YouTube URL. Example usage: ${prefix}${command} <YouTube URL>`
      });
    }

    if (!/^https?:\/\/(www\.)?youtube\.com\/.*$/.test(args)) {
      return client.sendMessage(message.from, {
        text: "Invalid YouTube URL. Please provide a valid YouTube link."
      });
    }

    try {
      await client.sendMessage(message.from, { text: "*Fetching video details, please wait...*" });

      const apiEndpoint = `https://api.siputzx.my.id/api/d/youtube?q=${encodeURIComponent(args)}`;
      console.log("Fetching URL:", apiEndpoint); // Debug log

      const response = await axios.get(apiEndpoint);
      console.log("API Response:", response.data); // Debug log

      if (response.status === 200 && response.data?.status) {
        const videoData = response.data.data;

        // Prepare the message to send to the user
        const messageText = `
        *Video Title:* ${videoData.title}
        *Duration:* ${videoData.duration}
        *Download Options:*
        1. *Download Video:* [Video Download Link](${videoData.video})
        2. *Download Audio:* [Audio Download Link](${videoData.sounds})
        
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
      console.error("Error fetching YouTube video:", error.message || error);
      await client.sendMessage(message.from, {
        text: "*Oops! Something went wrong while fetching the video details. Please try again later.*"
      });
    }
  }
};

export default youtubeCommand;
