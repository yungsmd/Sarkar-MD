import fetch from 'node-fetch';

import { prefix } from '../../config.cjs';  // Importing the prefix from config file

// Define the Google Image API URL

const googleImageApiUrl = 'https://api.giftedtech.my.id/api/search/googleimage?apikey=gifted&query=';

// Function to fetch and send image search results

async function sendImageSearchResults(m, { query, sendMessage, count }) {

    try {

        // Make a request to the API to search for images based on the query

        const response = await fetch(googleImageApiUrl + encodeURIComponent(query));

        const result = await response.json();

        // Check if results were found

        if (result.status === 200 && result.success && result.results.length > 0) {

            const imageUrls = result.results.slice(0, count);  // Get only the number of images requested

            // Send the specified number of images to the user

            for (let i = 0; i < imageUrls.length; i++) {

                await sendMessage(m.from, { image: { url: imageUrls[i] }, caption: `Image ${i + 1}: ${query}` });

            }

        } else {

            await sendMessage(m.from, { text: '❌ No results found for your query.' });

        }

    } catch (error) {

        console.error('Error while fetching image data:', error);

        await sendMessage(m.from, { text: '❌ Something went wrong while fetching images. Please try again later.' });

    }

}

// Register the command

const command = async (m, { text, sendMessage }) => {

    const commandText = m.body.trim().split(' ')[0].toLowerCase();

    const query = m.body.slice(commandText.length).trim(); // Get the user query after the command

    // Extract the count if available, else default to 3

    let count = 3;  // Default to 3 images if no count is provided

    if (query.includes(' ')) {

        const parts = query.split(' ');

        query = parts.slice(0, parts.length - 1).join(' ');  // Remove count from query

        count = parseInt(parts[parts.length - 1], 10);  // Use the last part as count

    }

    // Validate if count is a number and within a reasonable range (e.g., 1-10)

    if (isNaN(count) || count < 1 || count > 10) {

        count = 3;  // If the count is invalid, default to 3

    }

    // Check if the query is empty

    if (!query) {

        await sendMessage(m.from, { text: 'Please provide a search query for images.' });

        return;

    }

    // Process the command based on the prefix and send the appropriate number of images

    if (commandText === `${prefix}gimage` || commandText === `${prefix}img` || commandText === `${prefix}image`) {

        await sendImageSearchResults(m, { query, sendMessage, count });

    } else {

        await sendMessage(m.from, { text: 'Invalid command. Please use img, gimage, or image followed by a query.' });

    }

};

export default command;