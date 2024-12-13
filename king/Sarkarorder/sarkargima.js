import _0x51eb9c from 'axios';
import _0x3dcf81 from '../../config.cjs';
const sleep = _0x32875d => new Promise(_0x49eafb => setTimeout(_0x49eafb, _0x32875d));
const imageCommand = async (_0x1613da, _0x34fae5) => {
  const _0x56d962 = _0x3dcf81.PREFIX;
  const _0x18e850 = _0x1613da.body.startsWith(_0x56d962) ? _0x1613da.body.slice(_0x56d962.length).split(" ")[0].toLowerCase() : '';
  const _0x17c3b5 = _0x1613da.body.slice(_0x56d962.length + _0x18e850.length).trim();
  const _0x50118c = ["image", "img", "gimage"];
  if (_0x50118c.includes(_0x18e850)) {
    if (!_0x17c3b5 && !(_0x1613da.quoted && _0x1613da.quoted.text)) {
      return _0x34fae5.sendMessage(_0x1613da.from, {
        'text': "Please provide some text, Example usage: " + (_0x56d962 + _0x18e850) + " black cats"
      });
    }
    if (!_0x17c3b5 && _0x1613da.quoted && _0x1613da.quoted.text) {
      _0x17c3b5 = _0x1613da.quoted.text;
    }
    try {
      await _0x34fae5.sendMessage(_0x1613da.from, {
        'text': "*Please wait*"
      });
      const _0x29a800 = [];
      for (let _0x14af34 = 0; _0x14af34 < 5; _0x14af34++) {
        const _0x5b75f7 = "https://api.guruapi.tech/api/googleimage?text=" + encodeURIComponent(_0x17c3b5);
        const _0x28c1c5 = await _0x51eb9c.get(_0x5b75f7, {
          'responseType': "arraybuffer"
        });
        if (_0x28c1c5.status === 200) {
          const _0x1d932e = Buffer.from(_0x28c1c5.data, "binary");
          _0x29a800.push(_0x1d932e);
        } else {
          throw new Error("Image generation failed");
        }
      }
      for (let _0x56cd26 = 0; _0x56cd26 < _0x29a800.length; _0x56cd26++) {
        await sleep(500);
        await _0x34fae5.sendMessage(_0x1613da.from, {
          'image': _0x29a800[_0x56cd26],
          'caption': ''
        }, {
          'quoted': _0x1613da
        });
      }
      await _0x1613da.React('✅');
    } catch (_0x204e4b) {
      console.error("Error fetching images:", _0x204e4b);
      await _0x34fae5.sendMessage(_0x1613da.from, {
        'text': "*Oops! Something went wrong while generating images. Please try again later.*"
      });
    }
  }
};
export default imageCommand;
