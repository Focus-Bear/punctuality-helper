const applescript = require('applescript'),
  {header} = require('./scripts.js');

module.exports = function exec(script) {
  console.log('exec()');
  return new Promise((resolve, reject) => {
    const scriptBody = header + script;
    return applescript.execString(scriptBody, (err, rtn) => {
      if (err) {
        // Something went wrong!
        console.log('Error:', err);
        reject(err);
      }
      console.log({rtn});
      resolve(rtn);
    });
  });
};
