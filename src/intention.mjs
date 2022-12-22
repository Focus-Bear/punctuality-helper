import {openURL} from './event.js';

const visitFocusBear = 'Visit Website',
  closeDialog = 'Close',
  buttons = [visitFocusBear, closeDialog];

async function showIntention(intention) {
  return new Promise((resolve, reject) => {
    try {
      const response = run(
        (intention, buttons) => {
          const text = `Got it. Here's the intention for future reference: ${intention}.\n\nIf you need help staying focused during meetings, check out focusbear.io Made by the same people who made this app.`;

          const app = Application.currentApplication();

          app.includeStandardAdditions = true;

          return app.displayDialog(
            text,
            {
              buttons,
              defaultButton: buttons[1],
              givingUpAfter: 30,
              withTitle: "Don't forget your intention:",
            },
            {timeout: 300},
          )?.buttonReturned;
        },
        intention,
        buttons,
      );
      if (response == buttons[0]) openURL('https://focusbear.io');
      resolve(response);
    } catch (e) {
      console.log('Error in showAlert()', e);
      reject(e);
    }
  });
}
