import axios from "axios";
import config from "../../config.js"; // Ensure config is an ES module

const weatherCommand = async (m, gss) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(" ")[0].toLowerCase() : "";

  if (cmd === "weather") {
    // Extract location from user input
    const location = m.body.split(" ").slice(1).join(" ");

    if (!location) {
      await gss.sendMessage(
        m.from,
        { text: "❌ Please provide a location after the command. Example: *!weather Karachi*" },
        { quoted: m }
      );
      return;
    }

    const weatherApiUrl = `https://api.giftedtech.my.id/api/search/weather?apikey=gifted&location=${encodeURIComponent(location)}`;
    const errorMessage = "❌ Failed to fetch weather information. Please try again later.";

    try {
      // Fetch weather information
      const response = await axios.get(weatherApiUrl);
      const data = response.data?.result;

      if (!data) {
        await gss.sendMessage(
          m.from,
          { text: "❌ Unable to fetch weather details for the given location. Please check the location and try again." },
          { quoted: m }
        );
        return;
      }

      // Extract relevant details
      const { location: loc, weather, main, wind, sys } = data;
      const weatherInfo = `🌦️ *Sarkar-MD Weather Info for ${loc}:*\n\n` +
        `🌍 *Country*: ${sys.country}\n` +
        `🌡️ *Temperature*: ${main.temp}°C (Feels like: ${main.feels_like}°C)\n` +
        `🌤️ *Condition*: ${weather.main} (${weather.description})\n` +
        `🌬️ *Wind*: ${wind.speed} m/s, ${wind.deg}°\n` +
        `💧 *Humidity*: ${main.humidity}%\n` +
        `🕑 *Sunrise*: ${new Date(sys.sunrise * 1000).toLocaleTimeString()}\n` +
        `🌅 *Sunset*: ${new Date(sys.sunset * 1000).toLocaleTimeString()}\n\n` +
        `_Sarkar-MD by Bandaheali_`;

      // Send weather information to the user
      await gss.sendMessage(
        m.from,
        { text: weatherInfo },
        { quoted: m }
      );
    } catch (error) {
      console.error("Weather Command Error:", error.message || error);

      await gss.sendMessage(
        m.from,
        { text: errorMessage },
        { quoted: m }
      );
    }
  }
};

export default weatherCommand;

// Sarkar-MD Weather Command POWERED BY BANDAHEALI
