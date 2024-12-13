import { promises as fs } from 'fs';

import path from 'path';

import fetch from 'node-fetch';

import config from '../../config.cjs';

const __filename = new URL(import.meta.url).pathname;

const __dirname = path.dirname(__filename);

const chatHistoryFile = path.resolve(__dirname, "../gpt_history.json");

// Read chat history from file

async function readChatHistoryFromFile() {

  try {

    const data = await fs.readFile(chatHistoryFile, "utf-8");

    return JSON.parse(data);

  } catch {

    return {};

  }

}

// Write chat history to file

async function writeChatHistoryToFile(history) {

  try {

    await fs.writeFile(chatHistoryFile, JSON.stringify(history, null, 2));

  } catch (error) {

    console.error("Error writing chat history:", error);

  }

}

// Delete chat history

async function deleteChatHistory(chatHistory, sender) {

  delete chatHistory[sender];

  await writeChatHistoryToFile(chatHistory);

}

// Update chat history

async function updateChatHistory(chatHistory, sender, message) {

  if (!chatHistory[sender]) {

    chatHistory[sender] = [];

  }

  chatHistory[sender].push(message);

  if (chatHistory[sender].length > 20) {

    chatHistory[sender].shift(); // Keep only the last 20 messages

  }

  await writeChatHistoryToFile(chatHistory);

}

// Main function

const mistral = async (message, botInstance) => {

  const chatHistory = await readChatHistoryFromFile();

  const text = message.body.trim();

  if (text === "/forget") {

    await deleteChatHistory(chatHistory, message.sender);

    await botInstance.sendMessage(message.from, { text: "Chat history deleted successfully." }, { quoted: message });

    return;

  }

  const prefix = config.PREFIX;

  if (!text.startsWith(prefix)) return; // Ignore messages without the prefix

  const command = text.slice(prefix.length).split(" ")[0].toLowerCase();

  const query = text.slice(prefix.length + command.length).trim();

  const validCommands = ['gpt', 'bot', 'ai'];

  if (!validCommands.includes(command)) return; // Ignore invalid commands

  if (!query) {

    await botInstance.sendMessage(message.from, { text: "*EXAMPLE:${prefix}gpt who is bandaheali?*" }, { quoted: message });

    return;

  }

  try {

    const preResponse = `AI GPT is processing your request...`; // Initial bot response

    await botInstance.sendMessage(message.from, { text: preResponse }, { quoted: message });

    // Fetch response from the API

    const apiUrl = `https://api.siputzx.my.id/api/ai/copilot?text=${encodeURIComponent(query)}`;

    const response = await fetch(apiUrl);

    if (!response.ok) {

      throw new Error(`API returned status ${response.status}`);

    }

    const result = await response.json();

    const botResponse = result.result;

    // Update chat history

    await updateChatHistory(chatHistory, message.sender, { role: "user", content: query });

    await updateChatHistory(chatHistory, message.sender, { role: "assistant", content: botResponse });

    // Send the final response with pushName

    const pushName = message.pushName || "User";

    const finalResponse = `Here's your response, ${pushName}:\n\n${botResponse}`;

    await botInstance.sendMessage(message.from, { text: finalResponse }, { quoted: message });

  } catch (error) {

    console.error("Error:", error);

    await botInstance.sendMessage(message.from, { text: "Something went wrong. Please try again later." }, { quoted: message });

  }

};

export default mistral;
