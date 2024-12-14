import config from '../../config.cjs'; // Correct import of config

const shutdownBot = async (m, Matrix) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const text = m.body.slice(prefix.length + cmd.length).trim();

  // Check if the command is 'shutdown'
  if (cmd === 'shutdown') {
    // Get the owner's phone number from the config file
    const ownerNumber = config.OWNER_NUMBER + '@s.whatsapp.net'; // Assuming you have OWNER_NUMBER in your config file

    // Check if the sender is the owner
    if (m.sender !== ownerNumber) {
      return m.reply("You are not authorized to shut down the bot.");
    }

    // Send shutdown confirmation to the user
    await m.reply("Bot is shutting down...");

    // Exit the process, effectively shutting down the bot
    process.exit(0);
  }
};

export default shutdownBot;
