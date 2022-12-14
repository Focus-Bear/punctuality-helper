const { showDialog } = require("./applescript/dialog.js"),
  openURL = require("./applescript/event.js");

const visitFocusBear = "Check out Focus Bear",
  closeDialog = "Close",
  buttons = [visitFocusBear, closeDialog];

async function showIntention(intention) {
  const text = `Got it. Here's your intention for future reference: 

${intention}.

If you need help staying focused during meetings, check out focusbear.io 
Made by the same people who made this app.`,
    title = "Your intention",
    response = await showDialog(title, text, buttons);

  if (response == buttons[0]) {
    openURL("https://focusbear.io");
  }
}

async function noIntention() {
  const text = `Got it. Enjoy a productive work session instead.

If you need help staying focused throughout the workday,
check out focusbear.io Made by the same people who made Late No More.`,
    title = "Enjoy your work session!",
    response = await showDialog(title, text, buttons);

  if (response == buttons[0]) {
    openURL("https://focusbear.io");
  }
}

module.exports = { showIntention, noIntention };
