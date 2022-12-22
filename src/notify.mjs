import {run} from '@jxa/run';
import {
  dialogStages,
  verbalAlerts,
  meetingQuestions,
  buttons,
  pauseBetweenBarksSeconds,
} from '../index.mjs';

import {showMeeting, openURL} from './event.js';
import {showIntention, noIntention} from './intention.mjs';

let barking = false;

function verbalAlert() {
  barking = setInterval(() => {
    const randomIndex = Math.floor(Math.random() * verbalAlerts.length),
      dialog = verbalAlerts[randomIndex];

    return run(toSay => {
      try {
        const app = Application.currentApplication();
        app.includeStandardAdditions = true;
        app.say(toSay);
      } catch (e) {
        console.log('Error in verbalAlerts()', e);
      }
    }, dialog);
  }, pauseBetweenBarksSeconds * 1000);
}

export function askMeetingQuestions() {
  run(meetingQuestions => {
    try {
      const app = Application.currentApplication(),
        {calendars} = Application('Calendar');

      app.includeStandardAdditions = true;

      const resp = app.displayDialog(
        meetingQuestions.join('\n'),
        {
          defaultAnswer: '\n \n \n',
          buttons: ['Close'],
          defaultButton: 'Close',
        },
        {timeout: 3},
      );
      return resp;
    } catch (e) {
      console.log('Error in askMeetingQuestions', e);
    }
  }, meetingQuestions);
}

async function showAlert(evt, line, givingUpAfter, buttons) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = run(
        (evt, line, givingUpAfter, buttons) => {
          const title = evt.summary + ' ' + evt.startDate,
            app = Application.currentApplication(),
            [present, truant] = buttons;

          app.includeStandardAdditions = true;

          return app.displayDialog(
            [line, '\n', evt.location, evt.url].join('\n'),
            {
              buttons: [present, truant],
              defaultButton: truant,
              givingUpAfter,
              withTitle: title,
            },
            {timeout: 300},
          )?.buttonReturned;
        },
        evt,
        line,
        givingUpAfter,
        buttons,
      );
      if (response == buttons[1]) await noIntention();
      resolve(response);
    } catch (e) {
      console.log('Error in showAlert()', e);
      reject(e);
    }
  });
}

export default async function notifyUser(evt) {
  console.log('Notifying user about', evt.summary, evt.startDate);

  const rightNow = new Date(),
    toGo = Math.floor((new Date(evt.startDate) - rightNow) / 1000),
    perStage = Math.floor(toGo / (dialogStages.length - 1)),
    finalLine = dialogStages[dialogStages.length - 1];

  for (let i = 0; i < dialogStages.length; i++) {
    const line = dialogStages[i],
      lastRow = i + 1 == dialogStages.length,
      givingUpAfter = !lastRow ? perStage : 0;

    if (lastRow && !barking) verbalAlert();

    const answer = await showAlert(evt, line, givingUpAfter, buttons),
      [present] = buttons;

    if (answer == present) {
      if (evt?.url) openURL(evt.url);
      // showMeeting(evt.calendar, evt.uid);  // shows iCal with meeting selected
      const intention = askMeetingQuestions();
      if (intention) await showIntention(intention);
    }
    if (answer) {
      clearInterval(barking);
      break;
    }
  }
}
