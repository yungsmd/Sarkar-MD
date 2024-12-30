import { toAudio } from '../../lib/converter.cjs';
import config from '../../config.cjs';

const tomp3 = async (m, gss, sock) => {
  try {
    const prefix = config.PREFIX;
    const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
    const text = m.body.slice(prefix.length + cmd.length).trim();

    const validCommands = ['tomp3', 'mp3'];

    if (!validCommands.includes(cmd)) return;

    if (!m.quoted || m.quoted.mtype !== 'videoMessage') {
      return sock.sendMessage(
        m.from,
        {
          text: `Send or reply to a video with caption *${prefix}${cmd}* to convert it into MP3.`,
          contextInfo: {
            isForwarded: true,
            forwardingScore: 500,
            externalAdReply: {
              title: "✨ Sarkar-MD ✨",
              body: "Convert videos to MP3 easily!",
              thumbnailUrl: 'https://files.catbox.moe/s1q8so.jpeg',
              sourceUrl: 'https://whatsapp.com/channel/0029VajGHyh2phHOH5zJl73P',
              mediaType: 1,
              renderLargerThumbnail: true,
            },
          },
        },
        { quoted: m }
      );
    }

    // Notify user about the process
    await sock.sendMessage(
      m.from,
      {
        text: 'Converting to MP3, please wait...',
        contextInfo: {
          isForwarded: false,
          forwardingScore: 1000,
          externalAdReply: {
            title: "✨ Sarkar-MD ✨",
            body: "Your MP3 is on the way!",
            thumbnailUrl: 'https://files.catbox.moe/s1q8so.jpeg',
            sourceUrl: 'https://whatsapp.com/channel/0029VajGHyh2phHOH5zJl73P',
            mediaType: 1,
            renderLargerThumbnail: true,
          },
        },
      },
      { quoted: m }
    );

    // Process video to MP3
    const media = await m.quoted.download();
    const audio = await toAudio(media, 'mp4');

    // Send the converted MP3
    await gss.sendMessage(
      m.from,
      {
        document: audio,
        mimetype: 'audio/mpeg',
        fileName: `Converted By ${gss.user.name}.mp3`,
      },
      { quoted: m }
    );

    // Send a forwardable success message
    const successMessage = `✨ Your video has been successfully converted to MP3! ✨\n\n*Powered by Sarkar-MD.*`;
    await sock.sendMessage(
      m.from,
      {
        text: successMessage,
        contextInfo: {
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterJid: '@newsletter',
            newsletterName: "Sarkar-MD",
            serverMessageId: -1,
          },
          forwardingScore: 999,
          externalAdReply: {
            title: "✨ Sarkar-MD ✨",
            body: "Enjoy your MP3!",
            thumbnailUrl: 'https://files.catbox.moe/s1q8so.jpeg',
            sourceUrl: 'https://whatsapp.com/channel/0029VajGHyh2phHOH5zJl73P',
            mediaType: 1,
            renderLargerThumbnail: true,
          },
        },
      },
      { quoted: m }
    );
  } catch (error) {
    console.error('Error:', error);
    sock.sendMessage(
      m.from,
      { text: 'An error occurred while processing the command.' },
      { quoted: m }
    );
  }
};

export default tomp3;
