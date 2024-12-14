import axios from 'axios';
import config from '../../config.cjs';

const fontStyles = async (m, Matrix) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const query = m.body.slice(prefix.length + cmd.length).trim();

  const validCommands = ['fonts', 'fancy', 'style'];

  if (!validCommands.includes(cmd)) return;

  if (!query) {
    return m.reply(`Usage: *${prefix}${cmd} <text>*\n\nExample: *${prefix}${cmd} Hello*`);
  }

  try {
    // API Request to fetch fancy fonts
    const apiUrl = `https://www.dark-yasiya-api.site/other/font?text=${encodeURIComponent(query)}`;
    const response = await axios.get(apiUrl);

    if (response.data?.status && response.data?.result) {
      const fonts = response.data.result;

      // Prepare numbered list of styles
      let replyMessage = `*Here are the styles for:* _${query}_\n\n`;
      fonts.forEach((font, index) => {
        replyMessage += `${index + 1}. *${font.name}*:\n${font.result}\n\n`;
      });

      replyMessage += `\n_Reply with a number to select a style._`;

      // Send the list to the user
      await m.reply(replyMessage);

      // Add a listener to capture user reply
      Matrix.on('message', async (msg) => {
        // Ensure the reply is from the same user and chat
        if (msg.key.fromMe || msg.from !== m.from || !msg.body.trim().match(/^\d+$/)) return;

        const selectedIndex = parseInt(msg.body.trim()) - 1;

        if (selectedIndex >= 0 && selectedIndex < fonts.length) {
          const selectedFont = fonts[selectedIndex];
          await Matrix.sendMessage(
            m.from,
            { text: `Here is your styled text:\n\n${selectedFont.result}` },
            { quoted: msg }
          );
        } else {
          await Matrix.sendMessage(
            m.from,
            { text: 'Invalid selection. Please reply with a valid number from the list.' },
            { quoted: msg }
          );
        }
      });
    } else {
      await m.reply('Could not fetch font styles. Please try again later.');
    }
  } catch (error) {
    console.error('Error fetching fonts:', error.message);
    await m.reply('An error occurred while fetching font styles. Please try again later.');
  }
};

export default fontStyles;
