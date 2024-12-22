import fetch from 'node-fetch';

import config from '../../config.cjs'; // Ensure config.cjs has your bot settings

const downloadFile = async (m, gss) => {

  const prefix = config.PREFIX; // Get prefix from config.cjs

  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';

  const args = m.body.slice(prefix.length + cmd.length).trim().split(' ');

  const url = args[0]; // The URL provided by the user

  const caption = args.slice(1).join(' ') || 'Downloaded by SARKAR-MD'; // Default caption if none provided

  // Allowed download commands
  const validCommands = ['gdrive', 'gdrivedl'];

  if (validCommands.includes(cmd)) {

    if (!url) {
      return m.reply('Please provide a valid Google Drive file URL.');
    }

    // API endpoint to fetch file
    const apiUrl = `https://api.giftedtech.my.id/api/download/gdrivedl?apikey=gifted&url=${encodeURIComponent(url)}`;

    try {

      // Fetch request to the Google Drive downloader API
      const response = await fetch(apiUrl);

      // Check if the response is not okay (any status other than 200)
      if (!response.ok) {
        const errorText = await response.text(); // Get the error text from the response
        console.error(`API Error: Status Code ${response.status}, Response Text: ${errorText}`);
        throw new Error(`API Error ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log('API response data:', data);

      // Extract the download link from the response
      const downloadUrl = data?.result?.download || null;

      if (!downloadUrl) throw new Error('Download URL not found in API response.');

      // Send the file to the user with caption
      await gss.sendMessage(m.from, { document: { url: downloadUrl }, caption, mimetype: 'application/octet-stream', fileName: data?.result?.name || 'downloaded_file' });

      // Optionally, delete the original command message after sending the file (for Baileys)
      await gss.sendMessage(m.key.remoteJid, { delete: m.key });

    } catch (error) {

      console.error('Error downloading file:', error.message);
      m.reply(`Failed to download the file. Error: ${error.message}. Please try again later.`);

    }

  }

};

export default downloadFile;
