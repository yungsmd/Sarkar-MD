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
