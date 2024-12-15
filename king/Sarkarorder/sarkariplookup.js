import axios from 'axios';
import config from '../../config.cjs';

const ipStalk = async (m, gss) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const text = m.body.slice(prefix.length + cmd.length).trim();
  const args = text.split(' ');

  const validCommands = ['ipstalk', 'lookup', 'iplocate'];

  if (validCommands.includes(cmd)) {
    if (!args[0]) return m.reply('Mention an IP address to stalk.');

    const ip = args[0];

    const apiResponse = await axios.get(`https://bk9.fun/stalk/ip?q=${ip}`);
    const data = apiResponse.data;

    if (data.status) {
      const ipData = data.BK9;

      let responseMessage = `🌍 *𝙸𝙿 𝙰𝙳𝚁𝙴𝚂𝚂 𝙸𝙽𝙵𝙾𝚁𝙼𝙰𝚃𝙸𝙾𝙽 𝙱𝚈 𝚂𝙰𝚁𝙺𝙰𝚁-𝙼𝙳*\n\n`;
      responseMessage += `  ◦  *IP*: ${ipData.ip}\n`;
      responseMessage += `  ◦  *Continent*: ${ipData.continent}\n`;
      responseMessage += `  ◦  *Country*: ${ipData.country} (${ipData.countryCode})\n`;
      responseMessage += `  ◦  *Region*: ${ipData.regionName}\n`;
      responseMessage += `  ◦  *City*: ${ipData.city}\n`;
      responseMessage += `  ◦  *Zip Code*: ${ipData.zip}\n`;
      responseMessage += `  ◦  *Latitude*: ${ipData.lat}\n`;
      responseMessage += `  ◦  *Longitude*: ${ipData.lon}\n`;
      responseMessage += `  ◦  *Timezone*: ${ipData.timezone}\n`;
      responseMessage += `  ◦  *Currency*: ${ipData.currency}\n`;
      responseMessage += `  ◦  *ISP*: ${ipData.isp}\n`;
      responseMessage += `  ◦  *Organization*: ${ipData.org}\n`;
      responseMessage += `  ◦  *AS*: ${ipData.as}\n`;
      responseMessage += `  ◦  *Reverse DNS*: ${ipData.reverse}\n`;
      responseMessage += `  ◦  *Mobile*: ${ipData.mobile ? 'Yes' : 'No'}\n`;
      responseMessage += `  ◦  *Proxy*: ${ipData.proxy ? 'Yes' : 'No'}\n`;
      responseMessage += `  ◦  *Hosting*: ${ipData.hosting ? 'Yes' : 'No'}\n
𝙿𝙾𝚆𝙴𝚁𝙴𝙳 𝙱𝚈 𝚂𝙰𝚁𝙺𝙰𝚁-𝙼𝙳 𝙲𝚁𝙴𝙰𝚃𝙴𝙳 𝙱𝚈 𝙱𝙰𝙽𝙳𝙰𝙷𝙴𝙰𝙻𝙸
`;

      await gss.sendMessage(m.from, { text: responseMessage }, { quoted: m });
    } else {
      m.reply('❌ IP address not found. Please check the input.');
    }
  }
};

export default ipStalk;
