import config from '../../config.cjs';

const restartCommand = async (m, Matrix) => {
  const botNumber = await Matrix.decodeJid(Matrix.user.id);
  const isCreator = [botNumber, config.OWNER_NUMBER + '@s.whatsapp.net'].includes(m.sender);

  // Check if the sender is the owner
  if (!isCreator) {
    return m.reply("*📛 THIS IS AN OWNER COMMAND*");
  }

  // Extract the command from the message
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const text = m.body.slice(prefix.length + cmd.length).trim();

  if (cmd === 'restart') {
    // Send confirmation message before restarting
    try {
      await Matrix.sendMessage(m.from, { text: "Restarting bot... Please wait a few seconds!" }, { quoted: m });
      console.log("Restarting bot...");
      
      // Restart the process
      process.exit(0);  // This will terminate the process and cause it to restart automatically if managed by a process manager (e.g., PM2)
    } catch (error) {
      console.error("Failed to restart bot:", error);
      await Matrix.sendMessage(m.from, { text: "Failed to restart the bot. Check console logs for errors." }, { quoted: m });
    }
  }
};

export default restartCommand;