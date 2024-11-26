import { exec } from "child_process";
import config from "../../config.cjs"; // PREFIX اور OWNER کا ڈیٹا لیں

const restartBot = async (message, client) => {
  const PREFIX = config.PREFIX; // Prefix
  const OWNER_NUMBER = config.OWNER; // مالک کا نمبر (مثلاً: "+1234567890")
  const userMessage = message.body.toLowerCase();

  // Restart command trigger
  if (userMessage === `${PREFIX}restart`) {
    if (message.sender !== OWNER_NUMBER) {
      // If user is not the owner
      await client.sendMessage(
        message.from,
        { text: "Only the bot owner can use this command!" },
        { quoted: message }
      );
      return;
    }

    try {
      // Inform owner about restart
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
