import { UploadFileUgu, TelegraPh } from '../uploader.js';
import { writeFile, unlink } from 'fs/promises';
import config from '../../config.cjs';

const MAX_FILE_SIZE_MB = 60; // Max file size allowed for upload

const tourl = async (m, gss) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const text = m.body.slice(prefix.length + cmd.length).trim();
  
  const validCommands = ['tourl', 'url'];

  if (validCommands.includes(cmd)) {
    if (!m.quoted || !['imageMessage', 'videoMessage', 'audioMessage'].includes(m.quoted.mtype)) {
      return m.reply(`Send/Reply with an image, video, or audio to upload ${prefix + cmd}`);
    }

    try {
      // Send a loading message
      const loadingMessage = await gss.sendMessage(m.from, { text: "*「▰▰▰▱▱▱▱▱▱▱」* Processing your file..." }, { quoted: m });

      const media = await m.quoted.download(); // Download the media from the quoted message
      if (!media) throw new Error('Failed to download media.');

      const fileSizeMB = media.length / (1024 * 1024); // Calculate file size in MB
      if (fileSizeMB > MAX_FILE_SIZE_MB) {
        await gss.sendMessage(m.from, { text: `File size exceeds the limit of ${MAX_FILE_SIZE_MB}MB.` }, { quoted: m });
        return;
      }

      const extension = getFileExtension(m.quoted.mtype);
      if (!extension) throw new Error('Unknown media type.');

      const filePath = `./${Date.now()}.${extension}`; // Save the media with proper extension
      await writeFile(filePath, media);

      let response;
      if (m.quoted.mtype === 'imageMessage') {
        response = await TelegraPh(filePath); // Upload image to TelegraPh
      } else {
        response = await UploadFileUgu(filePath); // Upload video/audio to Ugu
      }

      // Send the complete message with URL
      const mediaUrl = response.url || response; // Get the URL from the response
      await gss.sendMessage(m.from, { text: `*Here is your media, ${m.pushName}:*\n*URL:* ${mediaUrl}` }, { quoted: m });

      // Cleanup the temporary file
      await unlink(filePath);

    } catch (error) {
      console.error('Error processing media:', error);
      await gss.sendMessage(m.from, { text: 'Error processing your media. Please try again later.' }, { quoted: m });
    }
  }
};

// Function to get the file extension based on media type
const getFileExtension = (mtype) => {
  switch (mtype) {
    case 'imageMessage':
      return 'jpg';
    case 'videoMessage':
      return 'mp4';
    case 'audioMessage':
      return 'mp3';
    default:
      return null;
  }
};

export default tourl;