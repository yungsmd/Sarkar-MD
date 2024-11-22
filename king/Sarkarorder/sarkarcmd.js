import pkg from '@whiskeysockets/baileys';
const { generateWAMessageFromContent, prepareWAMessageMedia } = pkg;
import fs from 'fs';

const alive = async (m, Matrix) => {
  try {
    const uptimeSeconds = process.uptime();
    const days = Math.floor(uptimeSeconds / (24 * 3600));
    const hours = Math.floor((uptimeSeconds % (24 * 3600)) / 3600);
    const minutes = Math.floor((uptimeSeconds % 3600) / 60);
    const seconds = Math.floor(uptimeSeconds % 60);

    const prefix = /^[\\/!#.]/gi.test(m.body) ? m.body.match(/^[\\/!#.]/gi)[0] : '/';
    const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).toLowerCase() : '';

    if (['command', 'menu', 'help'].includes(cmd)) {
      // 1. Send Image
      const imagePath = '../files/Sarkar.jpeg'; // Replace with your image path
      if (!fs.existsSync(imagePath)) throw new Error('Image file not found!');
      const imageBuffer = fs.readFileSync(imagePath);
      const imageMedia = await prepareWAMessageMedia({ image: imageBuffer }, { upload: Matrix.waUploadToServer });

      const imageMessage = generateWAMessageFromContent(m.from, {
        imageMessage: imageMedia.imageMessage,
      }, {});

      await Matrix.relayMessage(imageMessage.key.remoteJid, imageMessage.message, {
        messageId: imageMessage.key.id,
      });

      // 2. Send Menu Text
      const menuMessage = `╭───━═━═━⊷ 
🤖 𝗕𝗢𝗧 𝗡𝗔𝗠𝗘: *_Sarkar MD_*
📟 𝗩𝗘𝗥𝗦𝗜𝗢𝗡: *_1.0.0_*
👤 𝗗𝗘𝗩: *_Sir Bandaheali_*
📈 *uptime*: *${days}d ${hours}h ${minutes}m ${seconds}s*
╰───━═━═━⊷

━━━━━🌟━━━━━

✨ 𝗦𝗔𝗥𝗞𝗔𝗥-𝗠𝗗 𝗖𝗢𝗠𝗠𝗔𝗡𝗗 𝗟𝗜𝗦𝗧 ✨
╭━━━━◈ SYSTEM ◈━━━╮
➤ ${prefix}𝗣𝗶𝗻𝗴
➤ ${prefix}𝗔𝗹𝗶𝘃𝗲
➤ ${prefix}𝗢𝘄𝗻𝗲𝗿
➤ ${prefix}𝗠𝗲𝗻𝘂 
╰━━━━━━━◈━━━━━━━╯

╭━━━━◈ OWNER ◈━━━━╮
➤ ${prefix}𝗝𝗼𝗶𝗻
➤ ${prefix}𝗟𝗲𝗮𝘃𝗲
➤ ${prefix}𝗕𝗹𝗼𝗰𝗸
➤ ${prefix}𝗨𝗻𝗯𝗹𝗼𝗰𝗸
➤ ${prefix}𝗦𝗲𝘁𝗽𝗽𝗯𝗼𝘁
➤ ${prefix}𝗔𝗻𝘁𝗶𝗰𝗮𝗹𝗹
➤ ${prefix}𝗦𝗲𝘁𝗻𝗮𝗺𝗲𝗯𝗼𝘁
➤ ${prefix}𝗔𝘂𝘁𝗼𝗧𝘆𝗽𝗶𝗻𝗴
➤ ${prefix}𝗔𝗹𝘄𝗮𝘆𝘀𝗢𝗻𝗹𝗶𝗻𝗲
➤ ${prefix}𝗔𝘂𝘁𝗼𝗥𝗲𝗮𝗱
➤ ${prefix}𝗮𝘂𝘁𝗼𝘀𝘃𝗶𝗲𝘄
 ╰━━━━━━◈━━━━━━╯

╭━━━◈ 𝗚𝗣𝗧 ◈━━━━╮
➤ ${prefix}𝗦𝗮𝗿𝗸𝗮𝗿
➤ ${prefix}𝗕𝘂𝗴
➤ ${prefix}𝗥𝗲𝗽𝗼𝗿𝘁
➤ ${prefix}𝗿𝗮𝘀𝗵𝗶𝗱
➤ ${prefix}𝗥𝗲𝗺𝗶𝗻𝗶
➤ ${prefix}𝗚𝗲𝗺𝗶𝗻𝗶 
╰━━━━━━◈━━━━━━╯

╭━━━━ 𝗖𝗢𝗡𝗩𝗘𝗥𝗧𝗘𝗥 ━━━╮
➤ ${prefix}𝗘𝗕𝗜𝗡𝗔𝗥𝗬
➤ ${prefix}𝗗𝗕𝗜𝗡𝗔𝗥𝗬
➤ ${prefix}𝗘𝗠𝗢𝗝𝗜𝗠𝗜𝗫
➤ ${prefix}𝗠𝗣𝟯 
╰━━━━━━━◈━━━━━━━╯

╭━━━━◈ 𝗚𝗥𝗢𝗨𝗣 ◈━━━╮
➤ ${prefix}𝗟𝗶𝗻𝗸𝗚𝗿𝗼𝘂𝗽
➤ ${prefix}𝗦𝗲𝘁𝗽𝗽𝗴𝗰
➤ ${prefix}𝗦𝗲𝘁𝗻𝗮𝗺𝗲
➤ ${prefix}𝗦𝗲𝘁𝗱𝗲𝘀𝗰
➤ ${prefix}𝗚𝗿𝗼𝘂𝗽
➤ ${prefix}𝗚𝗰𝘀𝗲𝘁𝘁𝗶𝗻𝗴
➤ ${prefix}𝗪𝗲𝗹𝗰𝗼𝗺𝗲
➤ ${prefix}𝗔𝗱𝗱
➤ ${prefix}𝗞𝗶𝗰𝗸
➤ ${prefix}𝗛𝗶𝗱𝗲𝗧𝗮𝗴
➤ ${prefix}𝗧𝗮𝗴𝗮𝗹𝗹
➤ ${prefix}𝗔𝗻𝘁𝗶𝗟𝗶𝗻𝗸
➤ ${prefix}𝗣𝗿𝗼𝗺𝗼𝘁𝗲
➤ ${prefix}𝗗𝗲𝗺𝗼𝘁𝗲 
╰━━━━━━━◈━━━━━━╯

╭━━◈ 𝗗𝗢𝗪𝗡𝗟𝗢𝗔𝗗 ◈━━━╮
➤ ${prefix}𝗔𝗽𝗸
➤ ${prefix}𝗙𝗮𝗰𝗲𝗯𝗼𝗼𝗸
➤ ${prefix}𝗠𝗲𝗱𝗶𝗮𝗳𝗶𝗿𝗲
➤ ${prefix}𝗚𝗱𝗿𝗶𝘃𝗲
➤ ${prefix}𝘆𝘁𝗺𝗽𝟯
➤ ${prefix}𝘆𝘁𝗺𝗽𝟰
➤ ${prefix}𝗣𝗹𝗮𝘆
➤ ${prefix}𝗦𝗼𝗻𝗴
➤ ${prefix}𝗩𝗶𝗱𝗲𝗼
➤ ${prefix}𝘆𝘁𝗺𝗽𝟯𝗱𝗼𝗰
➤ ${prefix}𝘆𝘁𝗺𝗽𝟰𝗱𝗼𝗰
➤ ${prefix}𝗧𝗶𝗸𝘁𝗼𝗸 
╰━━━━━━━◈━━━━━━━╯

╭━━━◈ 𝗦𝗘𝗔𝗥𝗖𝗛 ◈━━━╮
➤ ${prefix}𝗣𝗹𝗮𝘆
➤ ${prefix}𝘆𝘁𝘀
➤ ${prefix}𝗜𝗺𝗱𝗯
➤ ${prefix}𝗚𝗼𝗼𝗴𝗹𝗲
➤ ${prefix}𝗚𝗶𝗺𝗮𝗴𝗲
➤ ${prefix}𝗟𝘆𝗿𝗶𝗰𝘀
➤ ${prefix}GINFO 
╰━━━━━━━◈━━━━━━━╯

🌐 𝗠𝗢𝗥𝗘 𝗖𝗢𝗠𝗠𝗔𝗡𝗗𝗦 𝗖𝗢𝗠𝗜𝗡𝗚 𝗦𝗢𝗢𝗡! 🌐`;

      const textMessage = generateWAMessageFromContent(m.from, {
        conversation: menuMessage,
      }, {});

      await Matrix.relayMessage(textMessage.key.remoteJid, textMessage.message, {
        messageId: textMessage.key.id,
      });

      // 3. Send Audio
      const audioPath = '../files/sarkar.mp3'; // Replace with your audio file path
      if (!fs.existsSync(audioPath)) throw new Error('Audio file not found!');
      const audioBuffer = fs.readFileSync(audioPath);
      const audioMedia = await prepareWAMessageMedia({ audio: audioBuffer }, { upload: Matrix.waUploadToServer });

      const audioMessage = generateWAMessageFromContent(m.from, {
        audioMessage: {
          url: audioMedia.audioMessage.url,
          mimetype: 'audio/mpeg',
          fileLength: audioMedia.audioMessage.fileLength,
          ptt: true, // Set to true if you want to send it as a voice note
        },
      }, {});

      await Matrix.relayMessage(audioMessage.key.remoteJid, audioMessage.message, {
        messageId: audioMessage.key.id,
      });
    }
  } catch (error) {
    console.error('Error in alive command:', error.message);
    await Matrix.sendMessage(m.from, { text: '⚠️ کچھ غلط ہو گیا ہے۔ براہ کرم دوبارہ کوشش کریں۔' });
  }
};

export default alive;
