import pkg from '@whiskeysockets/baileys';
const { generateWAMessageFromContent, proto } = pkg;
import axios from 'axios';
import config from '../../config.cjs';

const searchRepo = async (m, sock) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';

  // Valid commands to trigger this function
  const validCommands = ['repo', 'sc', 'script'];

  if (validCommands.includes(cmd)) {
    const repoUrl = `https://api.github.com/repos/Sarkar-Bandaheali/Sarkar-MD`; // Replace with your GitHub repo API URL
    await handleRepoCommand(m, sock, repoUrl);
  }
};

const handleRepoCommand = async (m, sock, repoUrl) => {
  try {
    // Fetch repository information from GitHub API
    const response = await axios.get(repoUrl);
    const repoData = response.data;

    const {
      full_name,
      html_url,
      description,
      forks_count,
      stargazers_count,
      watchers_count,
      created_at,
      updated_at,
      owner,
    } = repoData;

    // Prepare the message text
    const messageText = `*🌐 GitHub Repository Information 🌐*\n\n` +
      `*📂 Name:* ${full_name}\n` +
      `*🔗 Link:* [Click Here](${html_url})\n` +
      `*📝 Description:* ${description || 'No description provided.'}\n` +
      `*⭐ Stars:* ${stargazers_count}\n` +
      `*🍴 Forks:* ${forks_count}\n` +
      `*👀 Watchers:* ${watchers_count}\n` +
      `*👤 Owner:* ${owner.login}\n` +
      `*📅 Created At:* ${new Date(created_at).toLocaleDateString()}\n` +
      `*♻️ Last Updated:* ${new Date(updated_at).toLocaleDateString()}\n\n` +
      `_✨ Powered by Sarkar-MD ✨_`;

    // Generate the message content
    const repoMessage = generateWAMessageFromContent(m.from, {
      extendedTextMessage: proto.Message.ExtendedTextMessage.create({
        text: messageText,
        matchedText: messageText,
        contextInfo: {
          externalAdReply: {
            title: full_name,
            body: 'GitHub Repository Information',
            mediaType: 2,
            thumbnailUrl: owner.avatar_url,
            sourceUrl: html_url,
          },
        },
      }),
    });

    // Send the repository information message
    await sock.relayMessage(m.from, repoMessage.message, {
      messageId: repoMessage.key.id,
    });

    // React with a success emoji
    await m.react('✅'); // React to indicate successful execution
  } catch (error) {
    console.error('Error fetching repository information:', error);

    // Reply with an error message
    m.reply('❌ Failed to fetch repository information. Please try again later.');
    await m.react('❌'); // React with error emoji
  }
};

export default searchRepo;