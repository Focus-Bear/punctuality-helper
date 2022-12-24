const {run} = require('@jxa/run');
const {
  DIALOG_STAGES,
  VERBAL_ALERTS,
  MEETING_QUESTIONS,
  MEETING_ACTION_BUTTONS,
  PAUSE_BETWEEN_BARKS_SECONDS,
} = require('../config.js');

const {openMeetingURL} = require('./event.js');

let barking = false;

function verbalAlert(evt) {
  barking = setInterval(() => {
    const randomIndex = Math.floor(Math.random() * VERBAL_ALERTS.length),
      dialog = VERBAL_ALERTS[randomIndex];

    return run(toSay => {
      try {
        const app = Application.currentApplication();
        app.includeStandardAdditions = true;
        app.say(toSay);
      } catch (e) {
        console.log('Error in VERBAL_ALERTS()', e);
      }
    }, dialog);
  }, PAUSE_BETWEEN_BARKS_SECONDS * 1000);
}

function askMeetingQuestions() {
  run(MEETING_QUESTIONS => {
    try {
      const app = Application.currentApplication(),
        {calendars} = Application('Calendar');

      app.includeStandardAdditions = true;

      const resp = app.displayDialog(
        MEETING_QUESTIONS.join('\n'),
        {
          defaultAnswer: '\n \n \n',
          buttons: ['Close'],
          defaultButton: 'Close',
        },
        {timeout: 3},
      );
      return resp;
    } catch (e) {
      console.log('Error in askMeetingQuestions()', e);
    }
  }, MEETING_QUESTIONS);
}

async function showAlert(evt, line, givingUpAfter, MEETING_ACTION_BUTTONS) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = run(
        (evt, line, givingUpAfter, MEETING_ACTION_BUTTONS) => {
          const title = evt.summary + ' ' + evt.startDate,
            app = Application.currentApplication(),
            [present, truant] = MEETING_ACTION_BUTTONS;

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
        MEETING_ACTION_BUTTONS,
      );
      if (response == buttons[1]) await noIntention();
      resolve(response);
    } catch (e) {
      console.log('Error in showAlert()', e);
      reject(e);
    }
  });
}

async function notifyUser(evt) {
  console.log('Notifying user about', evt.summary, evt.startDate);

  const rightNow = new Date(),
    toGo = Math.floor((new Date(evt.startDate) - rightNow) / 1000),
    perStage = Math.floor(toGo / (DIALOG_STAGES.length - 1)),
    finalLine = DIALOG_STAGES[DIALOG_STAGES.length - 1];

  for (let i = 0; i < DIALOG_STAGES.length; i++) {
    const line = DIALOG_STAGES[i],
      lastRow = i + 1 == DIALOG_STAGES.length,
      givingUpAfter = !lastRow ? perStage : 0;

    if (lastRow && !barking) verbalAlert();

    const answer = await showAlert(
        evt,
        line,
        givingUpAfter,
        MEETING_ACTION_BUTTONS,
      ),
      [present] = MEETING_ACTION_BUTTONS;

    if (answer == present) {
      if (evt?.url) openURL(evt.url);
      // showMeeting(evt.calendar, evt.uid);  // shows iCal with meeting selected
      askMeetingQuestions();
    }
    if (answer) {
      clearInterval(barking);
      break;
    }
  }
}

module.exports = {
  notifyUser,
};
