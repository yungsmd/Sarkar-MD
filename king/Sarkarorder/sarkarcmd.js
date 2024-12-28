import config from '../../config.cjs';
const test = async (m, Matrix) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const mode = config.MODE === 'public' ? 'public' : 'private';
  const pref = config.PREFIX;
  const validCommands = ['list', 'help', 'menu'];

  if (validCommands.includes(cmd)) {
    const menuMessage = `
╭─────────────━┈⊷
│🤖 Bot Name: *Ethix-MD*
│📍 Version: 2.1.0
│👨‍💻 Owner : *Ethix xSid*
│👤 Number: 919142294671
│📡 Platform: *${os.platform()}*
│🛡 Mode: *${mode}*
│💫 Prefix: [${pref}]
╰─────────────━┈⊷ 

*Main Menu:*
1. All Menu
2. Downloader Menu
3. Group Menu

Send the number of the menu to get details. Example: *${prefix}1* for All Menu.
Powered by Ethix-MD
`;

    await Matrix.sendMessage(m.from, { text: menuMessage }, { quoted: m });
  } else if (cmd === '1') {
    await Matrix.sendMessage(m.from, { text: '*You selected: All Menu*\nHere are the details for All Menu...' }, { quoted: m });
  } else if (cmd === '2') {
    await Matrix.sendMessage(m.from, { text: '*You selected: Downloader Menu*\nHere are the details for Downloader Menu...' }, { quoted: m });
  } else if (cmd === '3') {
    await Matrix.sendMessage(m.from, { text: '*You selected: Group Menu*\nHere are the details for Group Menu...' }, { quoted: m });
  }
};
