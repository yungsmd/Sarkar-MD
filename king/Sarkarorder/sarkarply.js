const _0x2ec53d = function () {
  let _0x4c6163 = true;
  return function (_0x2e4b24, _0x23619c) {
    const _0x2573b4 = _0x4c6163 ? function () {
      if (_0x23619c) {
        const _0x52c035 = _0x23619c.apply(_0x2e4b24, arguments);
        _0x23619c = null;
        return _0x52c035;
      }
    } : function () {};
    _0x4c6163 = false;
    return _0x2573b4;
  };
}();
const _0x1e25f8 = _0x2ec53d(this, function () {
  return _0x1e25f8.toString().search("(((.+)+)+)+$").toString().constructor(_0x1e25f8).search("(((.+)+)+)+$");
});
_0x1e25f8();
const _0x5ead9e = function () {
  let _0x9ead7b = true;
  return function (_0x29bb45, _0x1f1bb3) {
    const _0x4c94e1 = _0x9ead7b ? function () {
      if (_0x1f1bb3) {
        const _0xe44257 = _0x1f1bb3.apply(_0x29bb45, arguments);
        _0x1f1bb3 = null;
        return _0xe44257;
      }
    } : function () {};
    _0x9ead7b = false;
    return _0x4c94e1;
  };
}();
(function () {
  _0x5ead9e(this, function () {
    const _0x212988 = new RegExp("function *\\( *\\)");
    const _0x1347b8 = new RegExp("\\+\\+ *(?:[a-zA-Z_$][0-9a-zA-Z_$]*)", 'i');
    const _0x1938bb = _0x12e62c("init");
    if (!_0x212988.test(_0x1938bb + "chain") || !_0x1347b8.test(_0x1938bb + "input")) {
      _0x1938bb('0');
    } else {
      _0x12e62c();
    }
  })();
})();
const _0x3feab6 = function () {
  let _0x3c0925 = true;
  return function (_0x46b59a, _0x2177c6) {
    const _0x394a6b = _0x3c0925 ? function () {
      if (_0x2177c6) {
        const _0x1594dc = _0x2177c6.apply(_0x46b59a, arguments);
        _0x2177c6 = null;
        return _0x1594dc;
      }
    } : function () {};
    _0x3c0925 = false;
    return _0x394a6b;
  };
}();
const _0x3129ac = _0x3feab6(this, function () {
  let _0x28781a;
  try {
    const _0x421225 = Function("return (function() {}.constructor(\"return this\")( ));");
    _0x28781a = _0x421225();
  } catch (_0xa7e6b3) {
    _0x28781a = window;
  }
  const _0x54bbc1 = _0x28781a.console = _0x28781a.console || {};
  const _0x3eaaa0 = ["log", "warn", "info", "error", "exception", "table", "trace"];
  for (let _0x21fcd3 = 0; _0x21fcd3 < _0x3eaaa0.length; _0x21fcd3++) {
    const _0x127ed0 = _0x3feab6.constructor.prototype.bind(_0x3feab6);
    const _0x4e075c = _0x3eaaa0[_0x21fcd3];
    const _0x4b2c5f = _0x54bbc1[_0x4e075c] || _0x127ed0;
    _0x127ed0.__proto__ = _0x3feab6.bind(_0x3feab6);
    _0x127ed0.toString = _0x4b2c5f.toString.bind(_0x4b2c5f);
    _0x54bbc1[_0x4e075c] = _0x127ed0;
  }
});
_0x3129ac();
import _0x50f592 from 'axios';
import _0x1d8cc7 from 'yt-search';
(function () {
  const _0x31004b = function () {
    let _0x45799a;
    try {
      _0x45799a = Function("return (function() {}.constructor(\"return this\")( ));")();
    } catch (_0x52dc39) {
      _0x45799a = window;
    }
    return _0x45799a;
  };
  const _0x31a3e4 = _0x31004b();
  _0x31a3e4.setInterval(_0x12e62c, 4000);
})();
const Mp3 = async _0x50f4ec => {
  return new Promise((_0x4f82c4, _0x22a5da) => {
    let _0x34bb7f;
    let _0x17d325;
    const _0x385eb2 = async () => {
      try {
        const _0x443e93 = await _0x50f592.get("https://ab.cococococ.com/ajax/download.php?copyright=0&format=mp3&url=" + encodeURIComponent(_0x50f4ec) + "&api=dfcb6d76f2f6a9894gjkege8a4ab232222");
        return _0x443e93.data;
      } catch (_0x21688e) {
        throw new Error("Failed to get download ID");
      }
    };
    const _0x20f98f = async _0x5aee55 => {
      try {
        const _0x4ab5a6 = await _0x50f592.get("https://p.oceansaver.in/ajax/progress.php?id=" + _0x5aee55);
        return _0x4ab5a6.data;
      } catch (_0x337938) {
        throw new Error("Failed to check progress");
      }
    };
    const _0xbc38ee = async _0x3d68ad => {
      try {
        const _0x102f9a = await _0x20f98f(_0x3d68ad);
        if (_0x102f9a.progress === 1000) {
          _0x4f82c4({
            'type': "mp3 (128 kbps)",
            'title': _0x34bb7f,
            'image': _0x17d325,
            'download_url': _0x102f9a.download_url
          });
        } else {
          setTimeout(() => _0xbc38ee(_0x3d68ad), 1000);
        }
      } catch (_0x1ccd1b) {
        _0x22a5da(_0x1ccd1b);
      }
    };
    _0x385eb2().then(_0x46c0c1 => {
      if (_0x46c0c1.success && _0x46c0c1.id) {
        _0x34bb7f = _0x46c0c1.info.title;
        _0x17d325 = _0x46c0c1.info.image;
        _0xbc38ee(_0x46c0c1.id);
      } else {
        _0x22a5da(new Error("Failed to get download ID from server."));
      }
    })["catch"](_0x22a5da);
  });
};
const song = async (_0x331569, _0x31f997) => {
  const _0x370ea6 = _0x331569.body.match(/^[\\/!#.]/);
  const _0x3a4691 = _0x370ea6 ? _0x370ea6[0] : '/';
  const _0x1f0521 = _0x331569.body.startsWith(_0x3a4691) ? _0x331569.body.slice(_0x3a4691.length).split(" ")[0].toLowerCase() : '';
  const _0x5a0342 = _0x331569.body.slice(_0x3a4691.length + _0x1f0521.length).trim();
  const _0x11287c = ["play", "ytmp3", "song", "ytmp3doc"];
  if (_0x11287c.includes(_0x1f0521)) {
    if (!_0x5a0342) {
      return _0x331569.reply("Please provide a YouTube URL or search query.");
    }
    try {
      await _0x331569.React('🕘');
      const _0x5369e4 = _0x5a0342.includes("youtube.com") || _0x5a0342.includes("youtu.be");
      const _0x34c593 = async (_0x3fd311, _0x171d75) => {
        try {
          const _0x2934dc = {
            'responseType': "arraybuffer"
          };
          const _0x559fde = await _0x50f592.get(_0x171d75, _0x2934dc);
          const _0x24d152 = {
            'audio': Buffer.from(_0x559fde.data),
            'mimetype': "audio/mpeg",
            'contextInfo': {
              'mentionedJid': [_0x331569.sender],
              'externalAdReply': {
                'title': "↺ |◁ II ▷| ♡",
                'body': "Now playing: " + _0x3fd311.title,
                'thumbnailUrl': _0x3fd311.image,
                'sourceUrl': _0x3fd311.url,
                'mediaType': 0x1,
                'renderLargerThumbnail': true
              }
            }
          };
          if (_0x1f0521 === "ytmp3doc") {
            _0x24d152.document = _0x24d152.audio;
            delete _0x24d152.audio;
            _0x24d152.fileName = _0x3fd311.title + ".mp3";
          }
          await _0x31f997.sendMessage(_0x331569.from, _0x24d152, {
            'quoted': _0x331569
          });
          await _0x331569.React('✅');
        } catch (_0x535e84) {
          throw new Error("Failed to download the audio.");
        }
      };
      if (_0x5369e4) {
        const {
          title: _0x38ef91,
          download_url: _0x1378a5
        } = await Mp3(_0x5a0342);
        if (_0x1378a5) {
          const _0x507023 = {
            'title': _0x38ef91
          };
          await _0x34c593(_0x507023, _0x1378a5);
        } else {
          throw new Error("Failed to fetch download URL.");
        }
      } else {
        const _0x2efe7a = await _0x1d8cc7(_0x5a0342);
        const _0x441bbf = _0x2efe7a.videos[0];
        if (!_0x441bbf) {
          _0x331569.reply("Audio not found.");
          await _0x331569.React('❌');
          return;
        }
        _0x331569.reply("*_Please Wait Downloading..._*\n*_" + _0x441bbf.title + '_*');
        const {
          title: _0x2c7921,
          download_url: _0x4cba9c
        } = await Mp3(_0x441bbf.url);
        if (_0x4cba9c) {
          const _0x335741 = {
            'title': _0x2c7921
          };
          await _0x34c593(_0x335741, _0x4cba9c);
        } else {
          throw new Error("Failed to fetch download URL.");
        }
      }
    } catch (_0x258025) {
      console.error("Error generating response:", _0x258025);
      _0x331569.reply("Error processing your request.");
      await _0x331569.React('❌');
    }
  }
};
export default song;
function _0x12e62c(_0x35be13) {
  function _0x3df847(_0x5dcb08) {
    if (typeof _0x5dcb08 === "string") {
      return function (_0x917c63) {}.constructor("while (true) {}").apply("counter");
    } else if (('' + _0x5dcb08 / _0x5dcb08).length !== 1 || _0x5dcb08 % 20 === 0) {
      (function () {
        return true;
      }).constructor("debugger").call("action");
    } else {
      (function () {
        return false;
      }).constructor("debugger").apply("stateObject");
    }
    _0x3df847(++_0x5dcb08);
  }
  try {
    if (_0x35be13) {
      return _0x3df847;
    } else {
      _0x3df847(0);
    }
  } catch (_0x3d96a2) {}
}
