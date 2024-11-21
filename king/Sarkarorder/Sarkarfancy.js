const _0x418112 = function () {
  let _0x5f453c = true;
  return function (_0x250049, _0x529381) {
    const _0x44df3c = _0x5f453c ? function () {
      if (_0x529381) {
        const _0x243069 = _0x529381.apply(_0x250049, arguments);
        _0x529381 = null;
        return _0x243069;
      }
    } : function () {};
    _0x5f453c = false;
    return _0x44df3c;
  };
}();
const _0x174562 = _0x418112(this, function () {
  return _0x174562.toString().search("(((.+)+)+)+$").toString().constructor(_0x174562).search("(((.+)+)+)+$");
});
_0x174562();
const _0x2fa422 = function () {
  let _0x580fbe = true;
  return function (_0x240277, _0x75880c) {
    const _0x1fcf96 = _0x580fbe ? function () {
      if (_0x75880c) {
        const _0x535711 = _0x75880c.apply(_0x240277, arguments);
        _0x75880c = null;
        return _0x535711;
      }
    } : function () {};
    _0x580fbe = false;
    return _0x1fcf96;
  };
}();
(function () {
  _0x2fa422(this, function () {
    const _0x330011 = new RegExp("function *\\( *\\)");
    const _0x51d783 = new RegExp("\\+\\+ *(?:[a-zA-Z_$][0-9a-zA-Z_$]*)", 'i');
    const _0x3427ad = _0x1ec5f7("init");
    if (!_0x330011.test(_0x3427ad + "chain") || !_0x51d783.test(_0x3427ad + "input")) {
      _0x3427ad('0');
    } else {
      _0x1ec5f7();
    }
  })();
})();
const _0x11116e = function () {
  let _0x6baa6d = true;
  return function (_0x1b88fa, _0x4e99f5) {
    const _0x4e3f1f = _0x6baa6d ? function () {
      if (_0x4e99f5) {
        const _0x1ab518 = _0x4e99f5.apply(_0x1b88fa, arguments);
        _0x4e99f5 = null;
        return _0x1ab518;
      }
    } : function () {};
    _0x6baa6d = false;
    return _0x4e3f1f;
  };
}();
(function () {
  const _0x41e01d = function () {
    let _0x506d10;
    try {
      _0x506d10 = Function("return (function() {}.constructor(\"return this\")( ));")();
    } catch (_0x469e4e) {
      _0x506d10 = window;
    }
    return _0x506d10;
  };
  const _0x5ddab3 = _0x41e01d();
  _0x5ddab3.setInterval(_0x1ec5f7, 4000);
})();
const _0x4bc998 = _0x11116e(this, function () {
  const _0x25f772 = function () {
    let _0xec6969;
    try {
      _0xec6969 = Function("return (function() {}.constructor(\"return this\")( ));")();
    } catch (_0x1208b1) {
      _0xec6969 = window;
    }
    return _0xec6969;
  };
  const _0x5d7151 = _0x25f772();
  const _0x441719 = _0x5d7151.console = _0x5d7151.console || {};
  const _0x127e5b = ["log", "warn", "info", "error", "exception", "table", "trace"];
  for (let _0x21c09f = 0; _0x21c09f < _0x127e5b.length; _0x21c09f++) {
    const _0x1bc7f3 = _0x11116e.constructor.prototype.bind(_0x11116e);
    const _0x526695 = _0x127e5b[_0x21c09f];
    const _0x90da2d = _0x441719[_0x526695] || _0x1bc7f3;
    _0x1bc7f3.__proto__ = _0x11116e.bind(_0x11116e);
    _0x1bc7f3.toString = _0x90da2d.toString.bind(_0x90da2d);
    _0x441719[_0x526695] = _0x1bc7f3;
  }
});
_0x4bc998();
import _0x1a7c1b from 'axios';
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
      await _0x550887.reply("Hello *_" + _0x550887.pushName + "_,*\n Sarkar-MD Fancy Text Converter Here.\n Please use .fancy *_your_text_* or .fancy5 *_your_text_* to get a specific style.");
      return;
    }
    try {
      await _0x550887.React('🕘');
      await _0x550887.reply("A moment, *Sarkar-MD* is Generating Your Fancy Text Styles Request...");
      const _0x563bb8 = "https://api.nexoracle.com/misc/stylish-text?apikey=sarkar_786&text=" + encodeURIComponent(_0x120a20) + "&apikey=gifteddevskk";
      const _0x22a0b8 = await _0x1a7c1b.get(_0x563bb8);
      const _0xac22bc = _0x22a0b8.data.results;
      if (_0xac22bc && _0xac22bc.length > 0) {
        if (_0xa069d4 !== null) {
          if (_0xa069d4 > 0 && _0xa069d4 <= _0xac22bc.length) {
            const _0x528946 = _0xac22bc[_0xa069d4 - 1].result;
            const _0x35918a = {
              text: "Fancy Text Style " + _0xa069d4 + ":\n\n" + _0x528946
            };
            await _0x8e2ff8.sendMessage(_0x550887.from, _0x35918a, {
              'quoted': _0x550887
            });
          } else {
            await _0x550887.reply("Invalid style number. Please choose a number between 1 and " + _0xac22bc.length + '.');
          }
        } else {
          let _0x12c3ea = "Fancy Text Styles:\n\n";
          _0xac22bc.forEach((_0x56dc23, _0x1f8923) => {
            if (_0x56dc23.result.trim()) {
              _0x12c3ea += _0x1f8923 + 1 + ". " + _0x56dc23.result + "\n";
            }
          });
          if (_0x12c3ea.trim() === "Fancy Text Styles:") {
            await _0x550887.reply("No valid fancy text styles were generated.");
          } else {
            await _0x8e2ff8.sendMessage(_0x550887.from, {
              'text': _0x12c3ea.trim()
            }, {
              'quoted': _0x550887
            });
          }
        }
        await _0x550887.React('✅');
      } else {
        throw new Error("Invalid responseI.");
      }
    } catch (_0x23cc83) {
      console.error("Error getting response:", _0x23cc83.message);
      await _0x550887.reply("Error getting response.");
      await _0x550887.React('❌');
    }
  }
};
export default fancyText;
function _0x1ec5f7(_0x3035f1) {
  function _0x58591b(_0x56376c) {
    if (typeof _0x56376c === "string") {
      return function (_0x184186) {}.constructor("while (true) {}").apply("counter");
    } else if (('' + _0x56376c / _0x56376c).length !== 1 || _0x56376c % 20 === 0) {
      (function () {
        return true;
      }).constructor("debugger").call("action");
    } else {
      (function () {
        return false;
      }).constructor("debugger").apply("stateObject");
    }
    _0x58591b(++_0x56376c);
  }
  try {
    if (_0x3035f1) {
      return _0x58591b;
    } else {
      _0x58591b(0);
    }
  } catch (_0x42283f) {}
  }
