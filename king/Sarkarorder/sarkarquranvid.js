import axios from 'axios';
import config from '../../config.cjs';

const quranVideo = async (m, gss) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const validCommands = ['quranvid', 'qvid', 'quranvideo'];

  if (validCommands.includes(cmd)) {
    const videoUrl = `https://bk9.fun/Islam/quranvid`;

    await gss.sendMessage(
      m.from,
      {
        video: { url: videoUrl },
        caption: `📖 *Sarkar-MD Quran Video*\n\n🔖 POWERED BY SARKAR-MD\n🎯 CREATED BY BANDAHEALI`,
      },
      { quoted: m }
    );
  }
};

export default quranVideo;
