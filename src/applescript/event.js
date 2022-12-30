const exec = require('./exec.js');

module.exports = async function openURL(url) {
  const SCRIPT = `
set urlToOpen to "${url}"
tell application "Safari"
  activate
  open location urlToOpen in current tab of window 1
end tell
`;
  await exec(SCRIPT);
};
