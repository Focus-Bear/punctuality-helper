const exec = require('./exec.js');

module.exports = async function get(url) {
  const SCRIPT = `
set temp_file to (path to temporary items)
set temp_name to "focusbear.jpg"
set temp_file to (POSIX path of temp_file) & temp_name
set q_temp_file to quoted form of temp_file

do shell script "curl -s -f '${url}' -o " & temp_file & " > /dev/null" 
return temp_file`;

  return await exec(SCRIPT);
};
