import axios from 'axios';
import fs from 'fs';
import path from 'path';

const downloadApp = async (m, Matrix) => {
  const appApiUrl = `https://api.example.com/getAppDetails?appId=xyz`; // Replace with actual API endpoint
  const response = await axios.get(appApiUrl);

  if (response.data?.status && response.data?.result) {
    const { name, size, image, dl_link } = response.data.result;

    // Inform the user about the app
    await m.reply(`📝 *App Name:* ${name}\n📦 *Size:* ${size}\n\n⬇️ Downloading APK, please wait...`);

    try {
      const fileName = `${name.replace(/\s+/g, '_')}.apk`;
      const filePath = path.resolve(__dirname, fileName);

      // Download APK file
      const fileStream = fs.createWriteStream(filePath);
      const fileResponse = await axios({
        url: dl_link,
        method: 'GET',
        responseType: 'stream',
      });

      await new Promise((resolve, reject) => {
        fileResponse.data
          .pipe(fileStream)
          .on('finish', resolve)
          .on('error', reject);
      });

      // Send APK file to the user
      await Matrix.sendMedia(m.from, filePath, 'apk', `✅ Here is your app: *${name}*`, m);

      // Cleanup
      fs.unlinkSync(filePath);
    } catch (error) {
      console.error('Error downloading APK:', error.message);
      await m.reply('❌ Failed to download the app. Please try again later.');
    }
  } else {
    await m.reply('❌ Unable to fetch app details. Please check the API.');
  }
};

export default downloadApp;
