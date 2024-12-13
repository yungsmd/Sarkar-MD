import axios from 'axios';
import config from '../../config.cjs';

const youtubeSearchCommand = async (message, client) => {
  const prefix = config.PREFIX;
  const command = message.body.startsWith(prefix)
    ? message.body.slice(prefix.length).split(" ")[0].toLowerCase()
    : '';
  const searchQuery = message.body.slice(prefix.length + command.length).trim();

  const validCommands = ["play", "yt"];
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

        // Prepare the message text with options for the user to choose (1 for video, 2 for audio)
        const messageText = `
        *Title:* ${videoData.title}
        *Duration:* ${videoData.duration}
        *Views:* ${videoData.interaction?.views || "N/A"}
        
        *Choose Download Option:*
        - *1:* Download Video
        - *2:* Download Audio

        *Thumbnail:* ${videoData.thumbnailUrl}
        `;

        await client.sendMessage(message.from, { text: messageText });

        // Send the thumbnail image for the user to click (optional)
        await client.sendMessage(message.from, {
          image: { url: videoData.thumbnailUrl },
          caption: "Click on the thumbnail to choose a download option (1 or 2)."
        });

        // Wait for the user to respond with '1' or '2'
        client.on('message', async (response) => {
          if (response.from !== message.from || !response.body) return;  // Only respond to the original user

          if (response.body.trim() === '1') {
            // User chose to download the video
            await client.sendMessage(response.from, {
              text: `*Downloading Video...*\n[Click to Download Video](${videoData.video})`
            });
          } else if (response.body.trim() === '2') {
            // User chose to download the audio
            await client.sendMessage(response.from, {
              text: `*Downloading Audio...*\n[Click to Download Audio](${videoData.sounds})`
            });
          } else {
            // Invalid response
            await client.sendMessage(response.from, {
              text: "Invalid option. Please choose either '1' for video or '2' for audio."
            });
          }
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
