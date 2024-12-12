import { writeFile, unlink } from 'fs/promises';
import config from '../../config.cjs';

const setProfilePicture = async (m, gss) => {
  const botNumber = await gss.decodeJid(gss.user.id);
  const isOwner = [botNumber, config.OWNER_NUMBER + '@s.whatsapp.net'].includes(m.sender);
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';

  const validCommands = ['setpp', 'setprofilepic', 'profilepic', 'setppbot'];

  if (!validCommands.includes(cmd)) return; // Exit if the command is not valid

  if (!isOwner) {
    return m.reply('📛 This is an owner-only command.');
  }

  if (!m.quoted || m.quoted.mtype !== 'imageMessage') {
    return m.reply(`📸 Please reply to an image message to set it as the profile picture. Use: ${prefix + cmd}`);
  }

  try {
    const media = await m.quoted.download(); // Download the media from the quoted message
    if (!media) throw new Error('Failed to download media.');

    const filePath = `./${Date.now()}.png`;
    await writeFile(filePath, media);

    try {
      await gss.query({
        tag: 'iq',
        attrs: {
          to: botNumber,
          type: 'set',
          xmlns: 'w:profile:picture'
        },
        content: [{
          tag: 'picture',
          attrs: {
            type: 'image'
          },
          content: media
        }]
      });

      m.reply('✅ Profile picture updated successfully!');
    } catch (err) {
      console.error('Error sending profile picture update query:', err);
      m.reply('❌ Failed to update the profile picture.');
    } finally {
      await unlink(filePath); // Clean up the downloaded file
    }
  } catch (error) {
    console.error('Error handling profile picture update:', error);
    m.reply('❌ An error occurred while updating the profile picture.');
  }
};

export default setProfilePicture;
