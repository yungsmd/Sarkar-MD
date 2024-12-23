import config from '../../config.cjs'; // Ensure this matches your project setup

const alive = async (m, sock) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix)
    ? m.body.slice(prefix.length).split(' ')[0].toLowerCase()
    : '';

  if (cmd === "alive") {
    await m.React('⏳'); // React with a loading icon

    const aliveMessage = `✨ *Sarkar-MD is Online* ✨\n\n_🌟 Powered by Bandaheali 🌟_`;

    await m.React('✅'); // React with a success icon

    sock.sendMessage(
      m.from,
      {
        text: aliveMessage,
        contextInfo: {
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterJid: '120363199257221654@newsletter',
            newsletterName: "Sarkar-MD",
            serverMessageId: -1,
          },
          forwardingScore: 999, // Score to indicate it has been forwarded
          externalAdReply: {
            title: "✨ Sarkar-MD ✨",
            body: "Alive Status Check",
            thumbnailUrl: '', // Add thumbnail URL if required
            sourceUrl: '', // Add source URL if necessary
            mediaType: 1,
            renderLargerThumbnail: false,
          },
        },
      },
      { quoted: m }
    );
  }
};

export default alive;
