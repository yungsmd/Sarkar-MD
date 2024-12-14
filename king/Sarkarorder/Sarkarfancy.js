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
    // Fetch fonts from the API
    const apiUrl = `https://www.dark-yasiya-api.site/other/font?text=${encodeURIComponent(query)}`;
    const response = await axios.get(apiUrl);

    if (!response.data?.status || !response.data?.result) {
      throw new Error('Invalid API response structure');
    }

    const fonts = response.data.result;

    // Prepare message with all fonts
    let replyMessage = `*Here are the styles for:* _${query}_\n\n`;
    fonts.forEach((font) => {
      replyMessage += `*${font.name}*:\n${font.result}\n\n`;
    });

    // Send all styles to the user
    await Matrix.sendMessage(m.from, { text: replyMessage }, { quoted: m });
  } catch (error) {
    console.error('Error:', error.message);
    await m.reply('An error occurred while processing your request. Please try again later.');
  }
};

export default fontStyles;
