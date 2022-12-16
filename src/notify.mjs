import {run} from '@jxa/run';
import {
  dialogStages,
  verbalAlerts,
  meetingQuestions,
  buttons,
  pauseBetweenBarksSeconds,
} from '../index.mjs';

import {showMeeting, openMeetingURL} from './event.js';

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
    } catch (e) {
      console.log('Error in askMeetingQuestions', e);
    }
  }, meetingQuestions);
}

async function showAlert(evt, line, givingUpAfter, buttons) {
  return new Promise((resolve, reject) => {
    try {
      const response = run(
        (evt, line, givingUpAfter, buttons) => {
          const title = `${evt.summary} (${evt.calendarName}) ${evt.startDate}`,
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
      console.log('Event data', evt)
      if (evt?.url) {
        openMeetingURL(evt.url);
      } else if (evt?.location && evt.location.startsWith('http')) {
        openMeetingURL(evt.location);
      }
      // showMeeting(evt.calendar, evt.uid);  // shows iCal with meeting selected
      askMeetingQuestions();
    }
    if (answer) {
      clearInterval(barking);
      break;
    }
  }
}
