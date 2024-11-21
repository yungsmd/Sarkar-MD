import pkg, { prepareWAMessageMedia } from '@whiskeysockets/baileys';
const { generateWAMessageFromContent, proto } = pkg;

const alive = async (m, Matrix) => {
  const uptimeSeconds = process.uptime();
  const days = Math.floor(uptimeSeconds / (24 * 3600));
  const hours = Math.floor((uptimeSeconds % (24 * 3600)) / 3600);
  const minutes = Math.floor((uptimeSeconds % 3600) / 60);
  const seconds = Math.floor(uptimeSeconds % 60);

  const prefix = /^[\\/!#.]/gi.test(m.body) ? m.body.match(/^[\\/!#.]/gi)[0] : '/';
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).toLowerCase() : '';

  if (['alive', 'uptime', 'runtime'].includes(cmd)) {
    const uptimeMessage = `╭──────────◆
│  *SARKAR-MD STATUS*
│───────────◆
│ *Uptime Details:*
│  *Days:* ${days}
│  *Hours:* ${hours}
│  *Minutes:* ${minutes}
│  *Seconds:* ${seconds}
│───────────◆
│   ©Sarkar-MD
╰──────────◆`;

    const msg = generateWAMessageFromContent(
      m.from,
      {
        conversation: uptimeMessage,
      },
      {}
    );

    await Matrix.relayMessage(m.from, msg.message, { messageId: msg.key.id });
  }
};

export default alive;