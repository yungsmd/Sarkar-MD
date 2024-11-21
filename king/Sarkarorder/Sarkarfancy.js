import axios from 'axios';

const fancyCommand = async (message, Matrix) => {
  const inputText = message.body.trim();
  const commandPrefix = /^[\\/!#.]/;
  const prefix = inputText.match(commandPrefix) ? inputText[0] : '/';
  const command = inputText.startsWith(prefix)
    ? inputText.slice(prefix.length).split(' ')[0].toLowerCase()
    : '';
  const validCommands = ['fancy', 'fancytext'];

  if (validCommands.includes(command)) {
    const textToConvert = inputText.slice(prefix.length + command.length).trim();
    if (!textToConvert) {
      await message.reply(
        `Hello *_${message.pushName}_,*\nUse this command to generate fancy text styles.\nExample: *.fancy your_text*`
      );
      return;
    }

    try {
      // Indicate processing
      await message.React('🕘');
      await message.reply("Please wait, generating your fancy text...");

      // API call
      const apiUrl = `https://api.nexoracle.com/misc/stylish-text?apikey=sarkar_786&text=${encodeURIComponent(textToConvert)}`;
      const apiResponse = await axios.get(apiUrl);
      const results = apiResponse.data.results;

      if (results && results.length > 0) {
        let responseText = `Fancy Text Styles for "${textToConvert}":\n\n`;
        results.forEach((style, index) => {
          if (style.result.trim()) {
            responseText += `${index + 1}. ${style.result}\n`;
          }
        });

        // Send the response
        await Matrix.sendMessage(message.from, { text: responseText }, { quoted: message });
        await message.React('✅');
      } else {
        throw new Error("No fancy styles generated.");
      }
    } catch (error) {
      console.error("Error processing the fancy text command:", error.message);
      await message.reply("Sorry, there was an error generating the fancy text. Please try again later.");
      await message.React('❌');
    }
  }
};

export default fancyCommand;
