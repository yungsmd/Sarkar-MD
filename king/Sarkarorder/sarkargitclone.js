// Sarkar-MD
import axios from 'axios';
import { createWriteStream } from 'fs';
import fs from 'fs';
import path from 'path';
import config from '../../config.js'; // Assuming config is now a .js file

// GitClone Command Function
const gitCloneCommand = async (m, gss) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const validCommands = ['gitclone', 'gitdownload'];

  if (validCommands.includes(cmd)) {
    // Extract the GitHub repository URL from the command (e.g., "!gitclone <url>")
    const repoUrl = m.body.split(' ')[1];

    if (!repoUrl) {
      await gss.sendMessage(
        m.from,
        { text: '❌ Please provide a valid GitHub repository URL after the command.' },
        { quoted: m }
      );
      return;
    }

    const apiUrl = `https://api.giftedtech.my.id/api/download/gitclone?apikey=gifted&url=${encodeURIComponent(repoUrl)}`;

    try {
      // Fetch data from API
      const response = await axios.get(apiUrl);
      console.log('API Response:', response.data); // Log the full response for debugging

      const apiData = response.data;

      if (apiData.status === 200 && apiData.success) {
        const result = apiData.result;

        // Download the zip file using the download_url
        const downloadUrl = result.download_url;
        const filePath = path.join(path.dirname(import.meta.url), `${result.name}.zip`);
        
        // Create a write stream to save the file locally
        const writer = createWriteStream(filePath);

        // Fetch and pipe the file content to the write stream
        const downloadResponse = await axios.get(downloadUrl, { responseType: 'stream' });
        downloadResponse.data.pipe(writer);

        writer.on('finish', async () => {
          // Send the zip file to the user after it's fully downloaded
          await gss.sendMessage(
            m.from,
            {
              document: { url: filePath }, // Path to the downloaded file
              fileName: `${result.name}.zip`, // Name of the file
              mimetype: 'application/zip', // Mimetype for zip files
              caption: `*📦 Repository Name*: ${result.name}\n*🔗 Downloaded Repo:* ${downloadUrl}\n\nEnjoy downloading the repository!`,
            },
            { quoted: m }
          );
          // Clean up the downloaded file (optional)
          fs.unlinkSync(filePath);
        });

        writer.on('error', async (err) => {
          console.error('Error downloading the file:', err);
          await gss.sendMessage(
            m.from,
            { text: '❌ Failed to download the repository. Please try again later.' },
            { quoted: m }
          );
        });
      } else {
        console.log('API Response Error:', apiData); // Log the error if the status is not 200 or success is false
        await gss.sendMessage(
          m.from,
          { text: '❌ Failed to fetch repository details. Please check the URL or try again later.' },
          { quoted: m }
        );
      }
    } catch (error) {
      console.error('GitClone Command Error:', error); // Log the error message for debugging
      await gss.sendMessage(
        m.from,
        { text: '❌ An error occurred while processing the GitClone command. Please try again later.' },
        { quoted: m }
      );
    }
  }
};

export default gitCloneCommand;

// Sarkar-MD GitClone Command POWERED BY BANDAHEALI
