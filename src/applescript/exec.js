const applescript = require("applescript");

const { SCRIPT_HEADER } = require("./scripts.js");

module.exports = function exec(SCRIPT) {
  return new Promise((resolve, reject) => {
    return applescript.execString(SCRIPT_HEADER + SCRIPT, (err, rtn) => {
      if (err) {
        console.log("Error:", err);
        reject(err);
      }
      resolve(rtn);
    });
  });
};
