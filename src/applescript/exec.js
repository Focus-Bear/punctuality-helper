const applescript = require("applescript");

const { header } = require("./scripts.js");

module.exports = function exec(script) {
  return new Promise((resolve, reject) => {
    const scriptBody = header + script;
    return applescript.execString(scriptBody, (err, rtn) => {
      if (err) {
        console.log("Error:", err);
        reject(err);
      }
      resolve(rtn);
    });
  });
};
