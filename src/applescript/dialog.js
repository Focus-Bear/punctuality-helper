const exec = require('./exec.js');

const files = require('./files.js');

const url =
  'https://user-images.githubusercontent.com/1034890/209779279-7b23e061-c5af-4129-9d51-1e674a0818e8.jpg';

async function showDialog(
  title,
  text,
  buttons,
  givingUpAfter = 30,
  showIcon = false,
) {

  const path = files(url)
  const SCRIPT = ` 
--set theImage to alias of thePath as string
set theImage to (path to temporary items as text) & "focusbear.png"
log theImage
set dialogText to "${text}"
set button1Label to "${buttons[0]}"
set button2Label to "${buttons[1]}"
set timeoutValue to ${givingUpAfter} 
set result to (display dialog dialogText with title "${title}" buttons {button1Label, button2Label} default button button1Label giving up after ${givingUpAfter} ${
    showIcon ? 'with icon theImage' : ''
  })
set buttonReturned to result's button returned
return buttonReturned`;
  return await exec(SCRIPT);
}

async function askQuestion(questionText) {
  const SCRIPT = `set dialogText to "${questionText}"
set defaultText to "default text"
set dialogTitle to "Set Your Intention"
set result to display dialog dialogText default answer defaultText with title dialogTitle
set userInput to result's text returned
return userInput`;
  return await exec(SCRIPT);
}
module.exports = {showDialog, askQuestion};
