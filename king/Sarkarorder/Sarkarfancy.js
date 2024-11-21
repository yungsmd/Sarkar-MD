import axios from 'axios';

const fancyText = async (_0x550887, _0x8e2ff8) => {
  const _0x13b61d = _0x550887.body.match(/^[\\/!#.]/);
  const _0xe0187 = _0x13b61d ? _0x13b61d[0] : '/';
  const _0xf1d210 = _0x550887.body.startsWith(_0xe0187) ? _0x550887.body.slice(_0xe0187.length).split(" ")[0].toLowerCase() : '';
  const _0x120a20 = _0x550887.body.slice(_0xe0187.length + _0xf1d210.length).trim();
  const _0x55180d = ["fancy", "fancytext"];
  if (_0x55180d.includes(_0xf1d210.split(/\d+/)[0])) {
    const _0x4bba83 = _0xf1d210.match(/\d+/);
    const _0xa069d4 = _0x4bba83 ? parseInt(_0x4bba83[0], 10) : null;
    if (!_0x120a20) {
      await _0x550887.reply(`Hello *_${_0x550887.pushName}_,*\nSarkar-MD Fancy Text Converter Here.\nPlease use .fancy *_your_text_* or .fancy5 *_your_text_* to get a specific style.`);
      return;
    }
    try {
      await _0x550887.React('🕘');
      await _0x550887.reply("A moment, *Sarkar-MD* is Generating Your Fancy Text Styles Request...");
      
      // Updated API integration
      const _0x563bb8 = `https://api.nexoracle.com/misc/stylish-text?apikey=sarkar_786&text=${encodeURIComponent(_0x120a20)}`;
      const _0x22a0b8 = await axios.get(_0x563bb8);
      const _0xac22bc = _0x22a0b8.data.results;
      
      if (_0xac22bc && _0xac22bc.length > 0) {
        if (_0xa069d4 !== null) {
          if (_0xa069d4 > 0 && _0xa069d4 <= _0xac22bc.length) {
            const _0x528946 = _0xac22bc[_0xa069d4 - 1].result;
            const _0x35918a = {
              text: `Fancy Text Style ${_0xa069d4}:\n\n${_0x528946}`
            };
            await _0x8e2ff8.sendMessage(_0x550887.from, _0x35918a, { quoted: _0x550887 });
          } else {
            await _0x550887.reply(`Invalid style number. Please choose a number between 1 and ${_0xac22bc.length}.`);
          }
        } else {
          let _0x12c3ea = "Fancy Text Styles:\n\n";
          _0xac22bc.forEach((_0x56dc23, _0x1f8923) => {
            if (_0x56dc23.result.trim()) {
              _0x12c3ea += `${_0x1f8923 + 1}. ${_0x56dc23.result}\n`;
            }
          });
          if (_0x12c3ea.trim() === "Fancy Text Styles:") {
            await _0x550887.reply("No valid fancy text styles were generated.");
          } else {
            await _0x8e2ff8.sendMessage(_0x550887.from, { text: _0x12c3ea.trim() }, { quoted: _0x550887 });
          }
        }
        await _0x550887.React('✅');
      } else {
        throw new Error("Invalid response.");
      }
    } catch (_0x23cc83) {
      console.error("Error getting response:", _0x23cc83.message);
      await _0x550887.reply("Error getting response.");
      await _0x550887.React('❌');
    }
  }
};

export default fancyText;
