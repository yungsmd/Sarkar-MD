import axios from 'axios';
import config from '../../config.cjs';

const npmStalk = async (m, gss) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const text = m.body.slice(prefix.length + cmd.length).trim();
  const args = text.split(' ');

  const validCommands = ['npmstalk', 'npmpackage', 'npminfo'];

  if (validCommands.includes(cmd)) {
    if (!args[0]) return m.reply('Mention an NPM package name to stalk.');

    const packageName = args[0];

    const apiResponse = await axios.get(`https://bk9.fun/stalk/npm?package=${packageName}`);
    const data = apiResponse.data;

    if (data.status) {
      const packageData = data.BK9;

      let responseMessage = `📦 *Sarkar-MD NPM Stalker*\n\n`;
      responseMessage += `  ◦  *Name*: ${packageData.name || 'N/A'}\n`;
      responseMessage += `  ◦  *Version*: ${packageData.version || 'N/A'}\n`;
      responseMessage += `  ◦  *Description*: ${packageData.desc || 'N/A'}\n`;
      responseMessage += `  ◦  *Date Published*: ${packageData.date_published || 'N/A'}\n`;
      responseMessage += `  ◦  *Published Info*: ${packageData.published_info || 'N/A'}\n`;
      responseMessage += `  ◦  *Weekly Downloads*: ${packageData.weekly_downloads || 'N/A'}\n`;
      responseMessage += `  ◦  *Weekly Dependents*: ${packageData.weekly_dependents || 'N/A'}\n`;

      if (packageData.keywords && packageData.keywords.length > 0) {
        responseMessage += `  ◦  *Keywords*: ${packageData.keywords.join(', ')}\n`;
      }

      if (packageData.info && packageData.info.length > 0) {
        responseMessage += `\n📃 *Additional Info*\n`;
        packageData.info.forEach(info => {
          responseMessage += `  ◦  *${info.type}*: ${info.result || 'N/A'}\n`;
        });
      }

      if (packageData.collaborator && packageData.collaborator.length > 0) {
        responseMessage += `\n👥 *Collaborators*\n`;
        packageData.collaborator.forEach(collab => {
          if (collab.username) {
            responseMessage += `  ◦  ${collab.username}\n`;
          }
        });
      }

      responseMessage += `\n\n🔖 *Powered by Bandaheali*`;

      await gss.sendMessage(m.from, { text: responseMessage }, { quoted: m });
    } else {
      m.reply('❌ NPM package not found. Please check the package name.');
    }
  }
};

export default npmStalk;
