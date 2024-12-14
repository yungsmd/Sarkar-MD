import axios from 'axios';
import config from '../../config.cjs';

const fontStyles = async (m, Matrix) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const query = m.body.slice(prefix.length + cmd.length).trim();

  if (!['fonts', 'fancy', 'style'].includes(cmd)) return;

  if (!query) {
    return m.reply(`Usage: *${prefix}${cmd} <text>*\n\nExample: *${prefix}${cmd} Hello*`);
  }

  try {
    const apiUrl = `https://www.dark-yasiya-api.site/other/font?text=${encodeURIComponent(query)}`;
    const response = await axios.get(apiUrl);

    if (!response.data?.status || !response.data?.result) {
      throw new Error('Invalid API response structure');
    }

    const fonts = response.data.result;

    let replyMessage = `*Here are the styles for:* _${query}_\n\n`;
    fonts.forEach((font, index) => {
      replyMessage += `${index + 1}. *${font.name}*:\n${font.result}\n\n`;
    });
    replyMessage += `\n_Reply with a number to select a style._`;

    await m.reply(replyMessage);

    // Add listener for user reply
    Matrix.on('message', async (msg) => {
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
  } catch (error) {
    console.error('Error:', error.message);
    await m.reply('An error occurred while processing your request. Please try again later.');
  }
};

export default fontStyles;
