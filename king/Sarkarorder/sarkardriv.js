import axios from 'axios';
import config from '../../config.cjs';

const gdriveDownload = async (m, Matrix) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const text = m.body.slice(prefix.length + cmd.length).trim();

  const validCommands = ['gdrive', 'gd', 'gddownload'];

  if (validCommands.includes(cmd)) {
    if (!text) {
      return m.reply('Please provide a Google Drive URL.');
    }

    try {
      await m.React('🕘');

      const apiUrl = `https://api.nexoracle.com/downloader/gdrive?apikey=sarkar_786&url=${encodeURIComponent(text)}`;

      const response = await axios.get(apiUrl);

      if (response.data?.status === 'success' && response.data?.data) {
        const mediaUrl = response.data.data;
        const caption = '> © Powered By Sarkar-MD';

        const extension = mediaUrl.split('.').pop().toLowerCase();

        await Matrix.sendMedia(m.from, mediaUrl, extension, caption, m);

        await m.React('✅');
      } else {
        m.reply('Failed to retrieve file. The file may not exist or there may be an API issue.');
        await m.React('❌');
      }
    } catch (error) {
      console.error('Error downloading Google Drive file:', error.message);
      m.reply(`Error downloading Google Drive file: ${error.message}`);
      await m.React('❌');
    }
  }
};

export default gdriveDownload;
