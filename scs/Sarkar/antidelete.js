import config from '../../config.cjs';

const antidelete = async (msg, sock) => {
   const botOwnerNumber = config.BOT_OWNER_NUMBER; // Bot owner number from config

   // Check if message was deleted
   if (msg.message && msg.messageProtocolMessage && msg.messageProtocolMessage.key) {
      const deletedMessageKey = msg.messageProtocolMessage.key;

      // Fetch the deleted message details
      const deletedMessage = await sock.loadMessage(deletedMessageKey.remoteJid, deletedMessageKey.id);

      // Forward the deleted message to the bot owner
      if (deletedMessage) {
         const forwardMessage = {
            key: {
               remoteJid: botOwnerNumber, // Bot owner number to forward message
               fromMe: true
            },
            message: deletedMessage.message
         };
         
         await sock.sendMessage(botOwnerNumber, forwardMessage.message);
         console.log(`Message forwarded to owner: ${botOwnerNumber}`);
      }
   }
};

export default antidelete;
