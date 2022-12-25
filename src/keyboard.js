const {GlobalKeyboardListener} = require('node-global-key-listener'),
  keyListener = new GlobalKeyboardListener();

const {stopBarking} = require('./notify.js');

keyListener.addListener(function (e, down) {
  if (down['LEFT SHIFT'] && down['LEFT META'] && down['LEFT CTRL'] && down['A'])
    stopBarking();
});
