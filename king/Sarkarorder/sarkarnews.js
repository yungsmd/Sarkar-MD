import axios from 'axios';
import config from '../../config.cjs';

const trendingNews = async (m, gss) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const validCommands = ['tnews', 'trendingnews', 'news'];

  if (validCommands.includes(cmd)) {
    const apiResponse = await axios.get(`https://bk9.fun/details/tnews`);
    const data = apiResponse.data;

    if (data.status) {
      const newsData = data.BK9;

      let responseMessage = `📰 *Sarkar-MD Trending News*\n\n`;
      responseMessage += `  ◦  *Title*: ${newsData.title}\n`;
      responseMessage += `  ◦  *Description*: ${newsData.desc}\n`;
      responseMessage += `  ◦  *Read More*: [Click Here](${newsData.link})\n\n`;
      responseMessage += `🔖 POWERED BY SARKAR-MD\n🎯 CREATED BY BANDAHEALI`;

      await gss.sendMessage(
        m.from,
        { image: { url: newsData.img }, caption: responseMessage },
        { quoted: m }
      );
    } else {
      m.reply('❌ Unable to fetch trending news. Please try again later.');
    }
  }
};

export default trendingNews;
