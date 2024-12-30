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
      return m.reply(`Send/Reply with Video to convert into MP3 with caption ${prefix + cmd}`);
    }

    m.reply('Converting to MP3, please wait...');
    const media = await m.quoted.download();
    const audio = await toAudio(media, 'mp4'); // Converts video to MP3

    // Send MP3 File
    await gss.sendMessage(
      m.from,
      { 
        document: audio, 
        mimetype: 'audio/mpeg', 
        fileName: `Converted By ${gss.user.name}.mp3` 
      }, 
      { quoted: m }
    );

    // Send Forwardable Contextual Message
    const aliveMessage = `✨ Your video has been successfully converted to MP3! ✨\n\nPowered by Sarkar-MD.`;
    await sock.sendMessage(
      m.from,
      {
        text: aliveMessage,
        contextInfo: {
          isForwarded: false,
          forwardedNewsletterMessageInfo: {
            newsletterJid: '@newsletter',
            newsletterName: "Sarkar-MD",
            serverMessageId: -1,
          },
          forwardingScore: 999, // Score indicating it has been forwarded
          externalAdReply: {
            title: "✨ Sarkar-MD ✨",
            body: "MY MENU",
            thumbnailUrl: 'https://files.catbox.moe/s1q8so.jpeg', // Thumbnail URL
            sourceUrl: 'https://whatsapp.com/channel/0029VajGHyh2phHOH5zJl73P', // Source URL
            mediaType: 1,
            renderLargerThumbnail: true,
          },
        },
      },
      { quoted: m }
    );
  } catch (error) {
    console.error('Error:', error);
    m.reply('An error occurred while processing the command.');
  }
};

export default tomp3;
