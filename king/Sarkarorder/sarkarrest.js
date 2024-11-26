import { exec } from "child_process";
import config from "../../config.cjs"; // PREFIX کا ڈیٹا لیں

const restartBot = async (message, client) => {
  const PREFIX = config.PREFIX; // Prefix
  const userMessage = message.body.toLowerCase();

  // Get the bot's number (creator number)
  const botNumber = await client.getHostNumber(); // بوٹ کا نمبر حاصل کریں

  // Restart command trigger
  if (userMessage === `${PREFIX}restart`) {
    if (message.sender !== botNumber) {
      // If user is not the bot's creator
      await client.sendMessage(
        message.from,
        { text: "Only the bot creator can use this command!" },
        { quoted: message }
      );
      return;
    }

    try {
      // Inform creator about restart
      await client.sendMessage(
        message.from,
        { text: "Restarting bot..." },
        { quoted: message }
      );

      // Execute restart command
      exec("pm2 restart all", (error, stdout, stderr) => {
        if (error) {
          console.error(`Error restarting bot: ${error.message}`);
          client.sendMessage(
            message.from,
            { text: "Failed to restart bot." },
            { quoted: message }
          );
          return;
        }

        console.log(`Bot restarted successfully: ${stdout}`);
        // Optionally, send a confirmation message after restart
      });
    } catch (error) {
      console.error("Restart Command Error: ", error);
      await client.sendMessage(
        message.from,
        { text: "Something went wrong during restart." },
        { quoted: message }
      );
    }
  }
};

export default restartBot;
