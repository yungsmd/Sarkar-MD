import config from '../../config.cjs';

const setGroupProfilePicture = async (m, gss) => {
  try {
    const botNumber = await gss.decodeJid(gss.user.id);
    const isOwner = [botNumber, config.OWNER_NUMBER + '@s.whatsapp.net'].includes(m.sender);
    const prefix = config.PREFIX;
    const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';

    // Command check
    if (!['setppgc', 'fullppgc'].includes(cmd)) return;

    // Validate group
    if (!m.isGroup) return m.reply("This command can only be used in groups!");

    // Fetch group metadata
    const groupMetadata = await gss.groupMetadata(m.chat);

    // Check if sender is admin
    const senderData = groupMetadata.participants.find((p) => p.id === m.sender);
    const isAdmin = senderData && (senderData.admin === 'admin' || senderData.admin === 'superadmin');

    // Allow only owner or admins to use this command
    if (!isOwner && !isAdmin) {
      return m.reply("You must be an *admin* or the *bot owner* to use this command.");
    }

    // Check for quoted image
    const quotedMessage = m.quoted || null;

    if (!quotedMessage || !(quotedMessage.mimetype && quotedMessage.mimetype.startsWith('image/'))) {
      return m.reply("Please reply to an image to set it as the group's profile picture.");
    }

    // Download image
    const image = await quotedMessage.download();
    if (!image) {
      return m.reply("Failed to download the image. Make sure you're replying to a valid image.");
    }

    // Update group profile picture
    await gss.updateProfilePicture(m.chat, image)
      .then(() => m.reply("✅ Group profile picture updated successfully!"))
      .catch((err) => {
        console.error('Update Error:', err);
        m.reply(`❌ Failed to update group profile picture. Error: ${err.message}`);
      });
  } catch (error) {
    console.error('Error:', error);
    m.reply("❌ An error occurred while processing the command. Please try again.");
  }
};

export default setGroupProfilePicture;
