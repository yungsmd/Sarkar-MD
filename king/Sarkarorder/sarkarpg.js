import config from '../../config.cjs'; // Ensure this matches your project setup

const ping = async (m, sock) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const text = m.body.slice(prefix.length + cmd.length).trim();

  if (cmd === "ping") {
    const start = new Date().getTime();
    await m.React('⏳'); // React with a loading icon
    const end = new Date().getTime();
    const responseTime = (end - start).toFixed(2);

    // Updated text style with Sarkar-MD branding and response rate
    const responseText = `*_Sarkar-MD Speed is_* ${responseTime} ms`; // Use responseText instead of reusing text
await m.React('✅️'); // React with a loading icon
    sock.sendMessage(m.from, { text: responseText }, { quoted: m });
  }
};

export default ping;


/* 
let handler = async (m, { conn, args, usedPrefix, command }) => {
let pp = ''
m.react('⏳')
	let _muptime
    if (process.send) {
      process.send('uptime')
      _muptime = await new Promise(resolve => {
        process.once('message', resolve)
        setTimeout(resolve, 1000)
      }) * 1000
    }
    let muptime = clockString(_muptime)
    let str = `🟢ᴘʀɪɴᴄᴇ ᴍᴅ ᴜᴘᴛɪᴍᴇ\n\n🎗️ʙᴏᴛ ᴀᴄᴛɪᴠᴇ ᴅᴜʀᴀᴛɪᴏɴ\n *${muptime}⏰*`
    conn.sendMessage(m.chat, {
      text: str,
      contextInfo: {
      
      mentionedJid: [m.sender],
      isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: '120363199257221654@newsletter',
                newsletterName: global.author,
                serverMessageId: -1
            },
      forwardingScore: 999,
      externalAdReply: {
      title: "🎗️ᴘʀɪɴᴄᴇ ᴍᴅ🎗️",
      body: "ʀᴜɴɪɴɢ sɪɴᴄᴇ",
      thumbnailUrl: pp,
      sourceUrl: '',
      mediaType: 1,
      renderLargerThumbnail: false
      }}})
      m.react('✅')
}
handler.help = ['runtime']
handler.tags = ['main']
handler.command = ['runtime', 'uptime', 'run']
export default handler

function clockString(ms) {
  let d = isNaN(ms) ? '--' : Math.floor(ms / 86400000)
  let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000) % 24
  let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
  let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
  return [d, 'd ', h, 'h ', m, 'm ', s, 's '].map(v => v.toString().padStart(2, 0)).join('')
}
*/
