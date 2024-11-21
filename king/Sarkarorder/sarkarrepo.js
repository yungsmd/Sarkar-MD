import pkg, { prepareWAMessageMedia } from '@whiskeysockets/baileys';
const { generateWAMessageFromContent } = pkg;
import axios from 'axios'; // Import axios for HTTP requests

const handleRepoCommand = async (m, Matrix) => {
  const repoUrl = 'https://api.github.com/repos/Sarkar-Bandaheali/Sarkar-MD';
  try {
    const response = await axios.get(repoUrl);
    const repoData = response.data;

    const { full_name, name, forks_count, stargazers_count, created_at, updated_at } = repoData;

    const messageText = `Hello *_${m.pushName}_,*\nThis is *Sarkar-MD,* a WhatsApp bot Created by *Bandaheali,* enhanced with amazing features to make your WhatsApp communication and interaction experience amazing!\n\n*❲❒❳ Name:* ${name}\n*❲❒❳ Stars:* ${stargazers_count}\n*❲❒❳ Forks:* ${forks_count}\n*❲❒❳ Created On:* ${new Date(created_at).toLocaleDateString()}\n*❲❒❳ Last Updated:* ${new Date(updated_at).toLocaleDateString()}\n\n*© Powered by Sarkar-MD*`;

    await Matrix.sendMessage(m.from, { text: messageText }, { quoted: m });
    await m.React("✅");
  } catch (error) {
    console.error("Error processing your request:", error);
    m.reply('Error processing your request.');
    await m.React("❌");
  }
};

const searchRepo = async (m, Matrix) => {
  const prefixMatch = m.body.match(/^[+×÷=/_<>[\]!@#.£%^&*()\-"'1234567890?,°€£^:;?¿‽】〕」』【〔「『<>_${}\|`《○♡○¡☆《●●■◇¡¤▪︎•°~♡●♧₩$€○》☆¡Abcdefghijklmonpqrstuvwxyz]/i);
  const prefix = prefixMatch ? prefixMatch[0] : '/';
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';

  const validCommands = ['repo', 'sc', 'script'];

  if (validCommands.includes(cmd)) {
    await handleRepoCommand(m, Matrix);
  }
};

export default searchRepo;
