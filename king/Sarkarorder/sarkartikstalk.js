import axios from 'axios';
import config from '../../config.cjs';

const tiktokStalk = async (m, gss) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const text = m.body.slice(prefix.length + cmd.length).trim();
  const args = text.split(' ');

  const validCommands = ['tiktokstalk', 'ttstalk', 'tikstalk'];

  if (validCommands.includes(cmd)) {
    if (!args[0]) return m.reply('Mention a TikTok username to stalk.');

    const username = args[0];

    const apiResponse = await axios.get(`https://bk9.fun/stalk/tiktok?q=${username}`);
    const data = apiResponse.data;

    if (data.status) {
      const profile = data.BK9;

      let responseMessage = `✨ *TikTok Profile* ✨\n\n`;
      responseMessage += `  ◦  *Name*: ${profile.name}\n`;
      responseMessage += `  ◦  *Username*: ${profile.username}\n`;
      responseMessage += `  ◦  *Followers*: ${profile.followers}\n`;
      responseMessage += `  ◦  *Following*: ${profile.following}\n`;
      responseMessage += `  ◦  *Bio*: ${profile.bio}\n`;
      responseMessage += `  ◦  *Likes*: ${profile.likes}\n`;
      responseMessage += `  ◦  *Profile Picture*: ${profile.profile}`;

      await gss.sendMessage(m.from, { image: { url: profile.profile }, caption: responseMessage }, { quoted: m });
    } else {
      m.reply('❌ TikTok user not found. Please check the username.');
    }
  }
};

export default tiktokStalk;
