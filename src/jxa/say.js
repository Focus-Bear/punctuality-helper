const { run } = require("@jxa/run");

module.exports = function say(dialog) {
  return run((toSay) => {
    try {
      const app = Application.currentApplication();
      app.includeStandardAdditions = true;
      app.say(toSay);
    } catch (e) {
      console.log("Error in jxa/say()", e);
    }
  }, dialog);
};
