const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const config = require('./config.cjs'); // Import the config file

// Function to update the bot
async function updateBot(message, reply) {
    const prefix = config.prefix; // Fetch the prefix dynamically

    if (!message.startsWith(prefix + 'update')) return; // Command check
    reply(`🔄 Updating the bot... Please wait.`);

    try {
        // Check if .env file and session folder exist
        if (!fs.existsSync('.env')) {
            reply('❌ Error: .env file not found. Update aborted.');
            return;
        }
        if (!fs.existsSync('session')) {
            reply('❌ Error: session folder not found. Update aborted.');
            return;
        }

        // Backup current .env file and session folder
        const tempFolder = '.temp_backup';
        if (!fs.existsSync(tempFolder)) fs.mkdirSync(tempFolder);
        fs.copyFileSync('.env', path.join(tempFolder, '.env'));
        fs.cpSync('session', path.join(tempFolder, 'session'), { recursive: true });

        // Clone repository to a temporary folder
        exec(
            `rm -rf .temp_repo && git clone http://github.com/Sarkar-Bandaheali/Sarkar-MD .temp_repo`,
            (cloneErr) => {
                if (cloneErr) {
                    reply(`❌ Error cloning the repository: ${cloneErr.message}`);
                    return;
                }

                // Copy updated files except .env and session folder
                const repoPath = path.resolve('.temp_repo');
                fs.readdirSync(repoPath).forEach((file) => {
                    if (file !== '.env' && file !== 'session') {
                        const src = path.join(repoPath, file);
                        const dest = path.resolve(file);
                        fs.cpSync(src, dest, { recursive: true });
                    }
                });

                // Restore .env file and session folder from backup
                fs.copyFileSync(path.join(tempFolder, '.env'), '.env');
                fs.cpSync(path.join(tempFolder, 'session'), 'session', { recursive: true });

                // Clean up temporary files and folders
                exec(`rm -rf .temp_repo ${tempFolder}`, (cleanupErr) => {
                    if (cleanupErr) {
                        reply(`⚠️ Bot updated but cleanup failed: ${cleanupErr.message}`);
                    } else {
                        reply("✅ Bot updated successfully!");
                    }
                });
            }
        );
    } catch (err) {
        reply(`❌ An error occurred: ${err.message}`);
    }
}

module.exports = updateBot;
