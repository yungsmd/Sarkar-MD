import config from '../../config.cjs';

const setGroupProfilePicture = async (m, gss) => {
  try {
    const botNumber = await gss.decodeJid(gss.user.id);
    const isCreator = [botNumber, config.OWNER_NUMBER + '@s.whatsapp.net'].includes(m.sender);
    const prefix = config.PREFIX;
    const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';

    if (!['setppgc', 'fullppgc'].includes(cmd)) return;

    if (!isCreator) return m.reply("*📛 THIS IS AN OWNER COMMAND*");

    if (!m.isGroup) return m.reply("This command can only be used in groups!");

    const groupMetadata = m.isGroup ? await gss.groupMetadata(m.chat) : {};
    const isAdmin = groupMetadata.participants.find(p => p.id === m.sender && p.admin);
    if (!isAdmin && !isCreator) {
      return m.reply("You must be an admin or the owner to change the group's profile picture.");
    }

    // Check if the message has a quoted image
    const quotedMessage = m.quoted || null;
    console.log('Quoted Message:', quotedMessage);

    if (!quotedMessage || !(quotedMessage.mimetype && quotedMessage.mimetype.startsWith('image/')) && quotedMessage.mtype !== 'imageMessage') {
      return m.reply("Please reply with an image to set as the group's profile picture.");
    }

    // Download the image from the quoted message
    console.log('Attempting to download group image...');
    const image = await quotedMessage.download();
    console.log('Image downloaded:', image);

    if (!image) {
      return m.reply("No image found. Please make sure you are replying to an image.");
    }

    // Set the group's profile picture
    await gss.updateProfilePicture(m.chat, image)
      .then(() => m.reply("Group profile picture updated successfully!"))
      .catch((err) => m.reply(`Failed to update group profile picture: ${err.message}`));

  } catch (error) {
    console.error('Error:', error);
    m.reply('An error occurred while processing the command.');
  }
};

export default setGroupProfilePicture;
