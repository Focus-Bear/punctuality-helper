const exec = require('./exec.js');

async function showDialog(title, text, buttons, givingUpAfter = 30) {
  console.log({title, text, buttons, givingUpAfter});
  const SCRIPT = `set dialogText to "${text}"
set button1Label to "${buttons[0]}"
set button2Label to "${buttons[1]}"
set timeoutValue to ${givingUpAfter} 
set result to (display dialog dialogText with title "${title}" buttons {button1Label, button2Label} default button button1Label giving up after ${givingUpAfter})
set buttonReturned to result's button returned
return buttonReturned`;
  await exec(SCRIPT);
}

async function askQuestion(questionText) {
  console.log({questionText});
  const SCRIPT = `set dialogText to "${questionText}"
set defaultText to "default text"
set dialogTitle to "Set Your Intention"
set result to display dialog dialogText default answer defaultText with title dialogTitle
set userInput to result's text returned
return userInput`;
  await exec(SCRIPT);
}
module.exports = {showDialog, askQuestion};
