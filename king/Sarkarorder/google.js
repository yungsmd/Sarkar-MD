import fetch from 'node-fetch';

import { promises as _0x57e686 } from 'fs';

import _0x2a91c7 from 'path';

import _0x371d13 from '@whiskeysockets/baileys';

import _0x2708d8 from '../../config.cjs'; // Your config file

const { generateWAMessageFromContent, proto } = _0x371d13;

// Define command structure for Google search

const googleSearch = async (_0x2737ca, _0x18423d) => {

  const _0x31917d = _0x2737ca.body.toLowerCase();

  const _0x198ec2 = _0x2708d8.PREFIX;

  

  // Command to trigger the search

  if (_0x31917d.startsWith(_0x198ec2 + 'google') || _0x31917d.startsWith(_0x198ec2 + 'search')) {

    const query = _0x2737ca.body.slice(_0x198ec2.length + 7).trim(); // Extract the query after 'google' or 'search'

    if (!query) {

      await _0x18423d.sendMessage(_0x2737ca.from, { text: '❌ Please provide a query to search.' }, { quoted: _0x2737ca });

      return;

    }

    try {

      await _0x2737ca.React('🔍'); // Show searching reaction

      // Fetch the Google search result

      const apiUrl = `https://api.giftedtech.my.id/api/search/google?apikey=gifted&query=${encodeURIComponent(query)}`;

      const response = await fetch(apiUrl);

      const data = await response.json();

      // Log the full API response to understand its structure

      console.log('Full API Response:', data);

      // Check if results are present

      if (data && data.results && Array.isArray(data.results) && data.results.length > 0) {

        let resultMessage = `🔎 *Google Search Results* for "${query}":\n\n`;

        // Iterate through all results and format them

        data.results.forEach((result, index) => {

          resultMessage += `

${index + 1}. *Title*: ${result.title}

*Link*: ${result.url}

*Description*: ${result.description}\n

          `;

        });

        // Send the full result message

        await _0x18423d.sendMessage(_0x2737ca.from, { text: resultMessage }, { quoted: _0x2737ca });

      } else {

        console.log('No results found for the query');

        await _0x18423d.sendMessage(_0x2737ca.from, { text: '❌ No results found for your query.' }, { quoted: _0x2737ca });

      }

      await _0x2737ca.React('✅'); // Show success reaction

    } catch (error) {

      console.error('Error during Google search:', error);

      await _0x18423d.sendMessage(_0x2737ca.from, { text: '❌ Something went wrong while searching. Please try again later.' }, { quoted: _0x2737ca });

      await _0x2737ca.React('❌'); // Show error reaction

    }

  }

};

export default googleSearch;