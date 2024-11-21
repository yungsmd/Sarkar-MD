import config from '../../config.cjs';

// Main command function
const antideleteCommand = async (m, Matrix) => {
  const botNumber = await Matrix.decodeJid(Matrix.user.id);
  const isCreator = [botNumber, config.OWNER_NUMBER + '@s.whatsapp.net'].includes(m.sender);
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const text = m.body.slice(prefix.length + cmd.length).trim();

  if (cmd === 'antidelete') {
    if (!isCreator) return m.reply("*📛 This command is for the bot owner only!*");

    let responseMessage;

    // Toggle the anti-delete feature
    if (text === 'on') {
      config.ANTI_DELETE = true;
      responseMessage = "Anti-Delete has been enabled. The bot will now notify you if a message is deleted.";
    } else if (text === 'off') {
      config.ANTI_DELETE = false;
      responseMessage = "Anti-Delete has been disabled. Deleted messages will no longer trigger notifications.";
    } else {
      responseMessage = "Usage:\n- `antidelete on`: Enable Anti-Delete\n- `antidelete off`: Disable Anti-Delete";
    }

    try {
      // Send response message to the user
      await Matrix.sendMessage(m.from, { text: responseMessage }, { quoted: m });
    } catch (error) {
      console.error("Error processing the Anti-Delete command:", error);
      await Matrix.sendMessage(m.from, { text: '❌ Error processing your request.' }, { quoted: m });
    }
  }
};

export default antideleteCommand;