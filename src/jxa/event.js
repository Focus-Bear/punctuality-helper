const { run } = require("@jxa/run");

module.exports = async function openURL(url) {
  return await run((url) => {
    console.log("Opening url ", url);
    try {
      const Safari = Application("Safari");

      Safari.activate();

      const window = Safari.windows[0],
        newTab = Safari.Tab({ url });

      window.tabs.push(newTab);
      window.currentTab = newTab;
    } catch (e) {
      console.log("Error in openURL() :", e);
    }
  }, url);
};
