import config from '../../config.cjs';

// Main event listener for deleted messages
const antidelete = async (m, Matrix) => {
  const botNumber = await Matrix.decodeJid(Matrix.user.id);
  const isCreator = [botNumber, config.OWNER_NUMBER + '@s.whatsapp.net'].includes(m.sender);

  // Check if the message is a deleted message
  if (m.messageStubType === 'REVOKE') {
    const deletedMessage = m.message;
    const ownerJid = config.OWNER_NUMBER + '@s.whatsapp.net';

    if (config.FORWARD_ON_DELETE && !isCreator) {
      // Format the message content
      let forwardContent = `A message was deleted in chat ${m.from}.\n\nSender: ${m.sender}\nDeleted message:\n${JSON.stringify(deletedMessage, null, 2)}`;

      try {
        // Send the deleted message to the owner's number
        await Matrix.sendMessage(ownerJid, { text: forwardContent }, { quoted: m });
      } catch (error) {
        console.error("Error forwarding the deleted message:", error);
      }
    }
  }
};

// Command to toggle the antidelete functionality
const antideleteCommand = async (m, Matrix) => {
  const botNumber = await Matrix.decodeJid(Matrix.user.id);
  const isCreator = [botNumber, config.OWNER_NUMBER + '@s.whatsapp.net'].includes(m.sender);
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const text = m.body.slice(prefix.length + cmd.length).trim();

  if (cmd === 'antidelete') {
    if (!isCreator) return m.reply("*Only admin*");
    let responseMessage;

    if (text === 'on') {
      config.FORWARD_ON_DELETE = true;
      responseMessage = "Anti-Delete has been enabled.";
    } else if (text === 'off') {
      config.FORWARD_ON_DELETE = false;
      responseMessage = "Anti-Delete has been disabled.";
    } else {
      responseMessage = "Usage:\n- `antidelete on`: Enable Anti-Delete\n- `antidelete off`: Disable Anti-Delete";
    }

    try {
      await Matrix.sendMessage(m.from, { text: responseMessage }, { quoted: m });
    } catch (error) {
      console.error("Error processing your request:", error);
      await Matrix.sendMessage(m.from, { text: 'Error processing your request.' }, { quoted: m });
    }
  }
};

export { antidelete, antideleteCommand };
