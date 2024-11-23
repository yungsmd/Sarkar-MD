import config from '../../config.cjs';

// Main command function
const anticallCommand = async (m, Matrix) => {
  const botNumber = await Matrix.decodeJid(Matrix.user.id);
  const isCreator = [botNumber, config.OWNER_NUMBER + '@s.whatsapp.net'].includes(m.sender);
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const text = m.body.slice(prefix.length + cmd.length).trim();

  // List of valid commands
  const validCommands = ['autostatus', 'setreaction'];

  // Only process valid commands
  if (!validCommands.includes(cmd)) return;

  // Check for owner
  if (!isCreator) return m.reply("*📛 THIS IS AN OWNER COMMAND*");

  // Handle specific commands
  switch (cmd) {
    case 'autostatus':
      if (text === 'on') {
        config.AUTO_STATUS_SEEN = true;
        await m.reply("✅ AUTO STATUS SEEN has been enabled.");
      } else if (text === 'off') {
        config.AUTO_STATUS_SEEN = false;
        await m.reply("❌ AUTO STATUS SEEN has been disabled.");
      } else {
        await m.reply(`Usage:\n- *${prefix + cmd} on:* Enable AUTO STATUS VIEW\n- *${prefix + cmd} off:* Disable AUTO STATUS VIEW`);
      }
      break;

    case 'setreaction':
      if (text) {
        config.AUTO_STATUS_REACTION = text; // Update the emoji
        await m.reply(`✅ Reaction has been set to: ${text}`);
      } else {
        await m.reply(`Usage: *${prefix + cmd} [emoji]*\nExample: *${prefix + cmd} 👍*`);
      }
      break;

    default:
      await m.reply("Invalid command.");
      break;
  }
};

// Auto Status Seen and Reaction Logic
Matrix.on('status-update', async (status) => {
  if (config.AUTO_STATUS_SEEN) {
    try {
      // Step 1: Mark Status as Seen
      await Matrix.sendReadReceipt(status.jid, status.participant, [status.key]);
      console.log(`✅ Status seen for: ${status.participant}`);

      // Step 2: Send Reaction (if configured)
      const reactionEmoji = config.AUTO_STATUS_REACTION || '👍'; // Default reaction
      await Matrix.sendMessage(status.jid, { react: { text: reactionEmoji, key: status.key } });
      console.log(`✅ Reacted with '${reactionEmoji}' to status of: ${status.participant}`);
    } catch (error) {
      console.error("❌ Error processing status reaction:", error);
    }
  } else {
    console.log("AUTO STATUS SEEN is disabled.");
  }
});

export default anticallCommand;
