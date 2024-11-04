import pkg, { prepareWAMessageMedia } from '@whiskeysockets/baileys';
const { generateWAMessageFromContent, proto } = pkg;
import getTikTokInfo from '@xaviabot/tiktok-downloader'; // Replace with your TikTok API library
import config from '../../config.cjs';

const tiktokSearchResultsMap = new Map();
let tiktokSearchIndex = 1;

const tiktokCommand = async (m, Matrix) => {
  let selectedListId;
  const selectedButtonId = m?.message?.templateButtonReplyMessage?.selectedId;
  const interactiveResponseMessage = m?.message?.interactiveResponseMessage;

  if (interactiveResponseMessage) {
    const paramsJson = interactiveResponseMessage.nativeFlowResponseMessage?.paramsJson;
    if (paramsJson) {
      const params = JSON.parse(paramsJson);
      selectedListId = params.id;
    }
  }

  const selectedId = selectedListId || selectedButtonId;

  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const text = m.body.slice(prefix.length + cmd.length).trim();

  const validCommands = ['tiktok', 'tt', 'ttdl'];

  if (validCommands.includes(cmd)) {
    if (!text) {
      return m.reply('Please provide a TikTok video URL.');
    }

    try {
      await m.React("🕘");

      const tiktokData = await getTikTokInfo(text); // Replace this with the function from your TikTok API
      console.log("tiktokData:", tiktokData);  // Log the data structure

      if (!tiktokData) {
        await m.reply('No results found.');
        await m.React("❌");
        return;
      }

      tiktokSearchResultsMap.set(tiktokSearchIndex, tiktokData);

      const videoQualities = [];
      if (tiktokData.sd) {
        videoQualities.push({ resolution: 'SD', url: tiktokData.sd });
      }
      if (tiktokData.hd) {
        videoQualities.push({ resolution: 'HD', url: tiktokData.hd });
      }

      const buttons = videoQualities.map((video, index) => ({
        "name": "quick_reply",
        "buttonParamsJson": JSON.stringify({
          display_text: `📥 Download ${video.resolution}`,
          id: `ttmedia_${index}_${tiktokSearchIndex}`
        })
      }));

      const sections = videoQualities.map((video) => ({
        title: 'Video Qualities',
        rows: [{
          title: `📥 Download ${video.resolution}`,
          description: `Resolution: ${video.resolution}`,
          id: `ttmedia_${tiktokSearchIndex}_${video.resolution}`
        }]
      }));

      const msg = generateWAMessageFromContent(m.from, {
        viewOnceMessage: {
          message: {
            messageContextInfo: {
              deviceListMetadata: {},
              deviceListMetadataVersion: 2
            },
            interactiveMessage: proto.Message.InteractiveMessage.create({
              body: proto.Message.InteractiveMessage.Body.create({
                text: `*Sarkar-MD TIKTOK POST DOWNLOADER*\n\n> *TITLE*: ${tiktokData.title}`
              }),
              footer: proto.Message.InteractiveMessage.Footer.create({
                text: "©Sarkar-MD by Bandaheali"
              }),
              header: proto.Message.InteractiveMessage.Header.create({
                ...(await prepareWAMessageMedia({ image: { url: tiktokData.thumbnail } }, { upload: Matrix.waUploadToServer })),
                title: "",
                gifPlayback: true,
                subtitle: "",
                hasMediaAttachment: false 
              }),
              nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                buttons
              }),
              contextInfo: {
                quotedMessage: m.message,
                mentionedJid: [m.sender],
                forwardingScore: 9999,
                isForwarded: true,
              }
            }),
          },
        },
      }, {});

      await Matrix.relayMessage(msg.key.remoteJid, msg.message, {
        messageId: msg.key.id
      });
      await m.React("✅");

      tiktokSearchIndex += 1; 
    } catch (error) {
      console.error("Error processing your request:", error);
      await m.reply('Error processing your request.');
      await m.React("❌");
    }
  } else if (selectedId) { 
    if (selectedId.startsWith('ttmedia_')) {
      const parts = selectedId.split('_');
      const qualityIndex = parseInt(parts[1]);
      const key = parseInt(parts[2]);
      const selectedMedia = tiktokSearchResultsMap.get(key);

      if (selectedMedia) {
        try {
          const videoQualities = [];
          if (selectedMedia.sd) {
            videoQualities.push({ resolution: 'SD', url: selectedMedia.sd });
          }
          if (selectedMedia.hd) {
            videoQualities.push({ resolution: 'HD', url: selectedMedia.hd });
          }

          const videoUrl = videoQualities[qualityIndex].url;
          let finalMediaBuffer, mimeType, content;

          finalMediaBuffer = await getStreamBuffer(videoUrl);
          mimeType = 'video/mp4';

          const fileSizeInMB = finalMediaBuffer.length / (1024 * 1024);

          if (fileSizeInMB <= 300) {
            content = { 
              video: finalMediaBuffer, 
              mimetype: 'video/mp4', 
              caption: '> © Sarkar-MD by bandaheali',
            };
            await Matrix.sendMessage(m.from, content, { quoted: m });
          } else {
            await m.reply('The video file size exceeds 300MB.');
          }
        } catch (error) {
          console.error("Error processing your request:", error);
          await m.reply('Error processing your request.');
          await m.React("❌");
        }
      }
    }
  }
};

const getStreamBuffer = async (url) => {
  const response = await fetch(url);
  const buffer = await response.arrayBuffer();
  return Buffer.from(buffer);
};

export default tiktokCommand;
