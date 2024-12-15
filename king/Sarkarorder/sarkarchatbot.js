import config from '../../config.cjs';
import fetch from 'node-fetch';

// Function to check and ignore owner messages based on phone number
const ignoreOwnerMessages = (senderNumber) => {
    const ownerNumber = config.OWNER_NUMBER; // Get the owner's phone number from config
    return senderNumber === ownerNumber; // Return true if the message is from the owner's number
};

const chatbotCommand = async (m, Matrix) => {

    const text = m.message?.conversation || m.message?.extendedTextMessage?.text || null; // Extract text
    const senderNumber = m.key.fromMe ? m.key.remoteJid : m.key.remoteJid.split('@')[0]; // Get sender's number (without @s.whatsapp.net)

    // Chatbot configuration
    const isChatbotEnabled = config.CHAT_BOT || false; // Enable/disable chatbot
    const chatbotMode = config.CHAT_BOT_MODE || 'public'; // 'private' or 'public'
    const privateUsers = config.PRIVATE_USERS || []; // Allowed users for private mode

    // Ignore all messages if chatbot is disabled
    if (!isChatbotEnabled) {
        console.log('Chatbot is disabled via config. Ignoring message.');
        return;
    }

    // Ignore owner's messages entirely (whether in a group or private message)
    if (ignoreOwnerMessages(senderNumber)) {
        console.log('Owner message ignored.');
        return; // Ignore the owner's message and stop further processing
    }

    // Ignore group, broadcast, and newsletter messages
    if (senderNumber.endsWith('@g.us') || senderNumber === 'status@broadcast' || senderNumber.includes('@newsletter')) {
        console.log('Group, broadcast, or newsletter message ignored.');
        return;
    }

    // Private mode: Process only specific users
    if (chatbotMode === 'private' && !privateUsers.includes(senderNumber)) {
        console.log(`Message from unauthorized user ignored in private mode: ${senderNumber}`);
        return;
    }

    // If there is no message text, return
    if (!text) {
        console.log('No valid message found to process.');
        return;
    }

    // Process user messages and fetch response from the API
    try {
        const userMessage = text;

        // Make the API call to the chatbot service
        const response = await fetch(`https://www.dark-yasiya-api.site/ai/chatgpt?q=${encodeURIComponent(userMessage)}`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const responseData = await response.json();
        const botReply = responseData.result || 'No response received';
        const formattedReply = `👾 SARKAR-MD AI ASSISTANT 🤖\n\nHello,\n\n${botReply}`;

        // Send the AI response to the user
        await Matrix.sendMessage(senderNumber + '@s.whatsapp.net', { text: formattedReply }, { quoted: m });

    } catch (err) {
        console.error('Error fetching AI response:', err.message);
        await Matrix.sendMessage(senderNumber + '@s.whatsapp.net', { text: '❌ Failed to fetch response from the server.' }, { quoted: m });
    }
};

export default chatbotCommand;
