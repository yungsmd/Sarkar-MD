import axios from 'axios';
import config from '../../config.cjs';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const imageCommand = async (message, client) => {
  const PREFIX = config.PREFIX;
  const command = message.body.startsWith(PREFIX) 
    ? message.body.slice(PREFIX.length).split(" ")[0].toLowerCase() 
    : '';
  let query = message.body.slice(PREFIX.length + command.length).trim();

  const supportedCommands = ["image", "img", "gimage"];
  if (supportedCommands.includes(command)) {
    if (!query && !(message.quoted && message.quoted.text)) {
      return client.sendMessage(message.from, {
        text: `Please provide some text. Example usage: ${PREFIX}${command} black cats`
      });
    }

    if (!query && message.quoted && message.quoted.text) {
      query = message.quoted.text;
    }

    try {
      await client.sendMessage(message.from, { text: "*Please wait*" });

      const apiUrl = `https://api.siputzx.my.id/api/images?query=${encodeURIComponent(query)}`;
      const response = await axios.get(apiUrl);

      if (response.status === 200 && response.data.status) {
        const images = response.data.data.slice(0, 5); // Max 5 images

        for (const img of images) {
          await sleep(500);
          await client.sendMessage(message.from, {
            image: { url: img.url },
            caption: `Here is an image for "${query}"`,
          }, { quoted: message });
        }

        await message.react('✅');
      } else {
        throw new Error("API returned an error or no data found.");
      }
    } catch (error) {
      console.error("Error fetching images:", error);
      await client.sendMessage(message.from, {
        text: "*Oops! Something went wrong while generating images. Please try again later.*"
      });
    }
  }
};

export default imageCommand;
