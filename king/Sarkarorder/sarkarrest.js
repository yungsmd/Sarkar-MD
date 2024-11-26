import config from '../../config.cjs';

const restartBot = async (m) => {
  try {
    const prefix = config.PREFIX;
    const cmd = m.body.startsWith(prefix)
      ? m.body.slice(prefix.length).split(' ')[0].toLowerCase()
      : '';
    
    // If command is 'restart'
    if (cmd === 'restart') {
      m.reply('⏳ Processing your request...');

      // Simulate a short delay before restarting for better user feedback
      setTimeout(() => {
        process.exit(0); // Use exit code 0 for a clean restart
      }, 2000);
    }
  } catch (error) {
    console.error(error);

    // React with ❌ if there's an error
    await m.react("❌");
    return m.reply(`⚠️ An error occurred while restarting the bot: ${error.message}`);
  }
};

export default restartBot;
