import axios from 'axios';
import config from '../../config.cjs';

const populationStats = async (m, gss) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const args = m.body.slice(prefix.length + cmd.length).trim();

  const validCommands = ['population', 'popstats', 'popinfo'];

  if (validCommands.includes(cmd)) {
    const apiResponse = await axios.get(`https://bk9.fun/details/population`);
    const data = apiResponse.data;

    if (data.status) {
      const popData = data.BK9;

      let responseMessage = `🌍 *Sarkar-MD Global Population Statistics*\n\n`;
      responseMessage += `📊 *Current Population:*\n`;
      responseMessage += `  ◦  *Total*: ${popData.current.total}\n`;
      responseMessage += `  ◦  *Male*: ${popData.current.male}\n`;
      responseMessage += `  ◦  *Female*: ${popData.current.female}\n\n`;
      
      responseMessage += `📅 *This Year:*\n`;
      responseMessage += `  ◦  *Births*: ${popData.this_year.births}\n`;
      responseMessage += `  ◦  *Deaths*: ${popData.this_year.deaths}\n\n`;

      responseMessage += `📆 *Today:*\n`;
      responseMessage += `  ◦  *Births*: ${popData.today.births}\n`;
      responseMessage += `  ◦  *Deaths*: ${popData.today.deaths}\n\n`;

      responseMessage += `🔖 POWERED BY SARKAR-MD\n🎯 CREATED BY BANDAHEALI`;

      await gss.sendMessage(m.from, { text: responseMessage }, { quoted: m });
    } else {
      m.reply('❌ Unable to fetch population data. Please try again later.');
    }
  }
};

export default populationStats;
