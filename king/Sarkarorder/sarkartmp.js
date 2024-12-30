import { toAudio } from '../../lib/converter.cjs';
import config from '../../config.cjs';

const tomp3 = async (m, gss, sock) => {
  try {
    console.log("Command execution started...");
    const prefix = config.PREFIX;
    const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
    console.log(`Extracted command: ${cmd}`);

    const validCommands = ['tomp3', 'mp3'];
    if (!validCommands.includes(cmd)) {
      console.log("Invalid command. Skipping...");
      return;
    }

    if (!m.quoted || m.quoted.mtype !== 'videoMessage') {
      console.log("Quoted message is not a video.");
      return sock.sendMessage(
        m.from,
        {
          text: `Send or reply to a video with caption *${prefix}${cmd}* to convert it into MP3.`,
        },
        { quoted: m }
      );
    }

    // Notify the user about the conversion
    await sock.sendMessage(
      m.from,
      {
        text: 'Converting to MP3, please wait...',
      },
      { quoted: m }
    );
    console.log("Notified user about conversion...");

    // Process the video
    const media = await m.quoted.download();
    console.log("Downloaded media successfully...");
    const audio = await toAudio(media, 'mp4');
    console.log("Converted video to MP3 successfully...");

    // Send the MP3 file
    await gss.sendMessage(
      m.from,
      {
        document: audio,
        mimetype: 'audio/mpeg',
        fileName: `Converted By ${gss.user.name}.mp3`,
      },
      { quoted: m }
    );
    console.log("Sent MP3 file successfully...");

    // Send a success message
    const successMessage = `✨ Your video has been successfully converted to MP3! ✨\n\n*Powered by Sarkar-MD.*`;
    await sock.sendMessage(
      m.from,
      {
        text: successMessage,
      },
      { quoted: m }
    );
    console.log("Sent success message.");
  } catch (error) {
    console.error('Error during MP3 conversion:', error);
    sock.sendMessage(
      m.from,
      { text: 'An error occurred while processing the command.' },
      { quoted: m }
    );
  }
};

export default tomp3;
