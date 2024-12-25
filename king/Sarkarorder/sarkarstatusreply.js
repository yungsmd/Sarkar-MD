// Sarkar-MD Auto Status Reply Command - POWERED BY BANDAHEALI

import config from "../../config.cjs";

// Main command function
const anticallCommand = async (m, Matrix) => {
  try {
    const botNumber = await Matrix.decodeJid(Matrix.user.id); // Get bot number
    const isCreator = [botNumber, `${config.OWNER_NUMBER}@s.whatsapp.net`].includes(m.sender); // Check owner
    const prefix = config.PREFIX;
    const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(" ")[0].toLowerCase() : "";
    const text = m.body.slice(prefix.length + cmd.length).trim(); // Extract the command arguments

    const validCommands = ["autostatusreply"]; // Command trigger
    if (validCommands.includes(cmd)) {
      // Ensure only the owner can access this
      if (!isCreator) {
        return await Matrix.sendMessage(m.from, { text: "*📛 THIS IS AN OWNER COMMAND*" }, { quoted: m });
      }

      let responseMessage;

      if (text.toLowerCase() === "on") {
        config.AUTO_STATUS_REPLY = true; // Enable Auto Status Reply
        responseMessage = "✅ AUTO STATUS REPLY has been *enabled*.";
      } else if (text.toLowerCase() === "off") {
        config.AUTO_STATUS_REPLY = false; // Disable Auto Status Reply
        responseMessage = "✅ AUTO STATUS REPLY has been *disabled*.";
      } else {
        responseMessage = `❌ Invalid input.\n\nUsage:\n- *${prefix}${cmd} on* - Enable AUTO STATUS REPLY\n- *${prefix}${cmd} off* - Disable AUTO STATUS REPLY`;
      }

      await Matrix.sendMessage(
        m.from,
        { text: responseMessage },
        { quoted: m }
      );
    }
  } catch (error) {
    console.error("Error processing the anticallCommand:", error);
    await Matrix.sendMessage(
      m.from,
      { text: "❌ Error processing your request. Please try again later." },
      { quoted: m }
    );
  }
};

export default anticallCommand;

// POWERED BY BANDAHEALI
