const {
  DIALOG_STAGES,
  VERBAL_ALERTS,
  MEETING_QUESTIONS,
  MEETING_ACTION_BUTTONS,
  PAUSE_BETWEEN_BARKS_SECONDS,
} = require("../config.js");

const { showDialog, askQuestion } = require("./jxa/dialog.js"),
  say = require("./jxa/say.js");

let barking = false;

function verbalAlert(evt) {
  const pauseFor = PAUSE_BETWEEN_BARKS_SECONDS * 1000;

  barking = setInterval(() => {
    const randomIndex = Math.floor(Math.random() * VERBAL_ALERTS.length),
      toSay = VERBAL_ALERTS[randomIndex];

    say(toSay);
  }, pauseFor);
}

async function askMeetingQuestions() {
  const question = MEETING_QUESTIONS.join("\n"),
    intention = await askQuestion(question);
}

async function showMeetingAlert(evt, line, givingUpAfter) {
  const title = evt.summary + " " + evt.startDate,
    text = [line, "\n", evt.location, evt.url].join("\n");

  return await showDialog(title, text, MEETING_ACTION_BUTTONS, givingUpAfter);
}

async function notifyUser(evt) {
  console.log("Notifying user about", evt.summary, evt.startDate);

  const rightNow = new Date(),
    toGo = Math.floor((new Date(evt.startDate) - rightNow) / 1000),
    perStage = Math.floor(toGo / (DIALOG_STAGES.length - 1)),
    finalLine = DIALOG_STAGES[DIALOG_STAGES.length - 1];

  for (let i = 0; i < DIALOG_STAGES.length; i++) {
    const line = DIALOG_STAGES[i],
      lastRow = i + 1 == DIALOG_STAGES.length,
      givingUpAfter = !lastRow ? perStage : 0;

    if (lastRow && !barking) verbalAlert();

    const answer = await showMeetingAlert(evt, line, givingUpAfter),
      [present] = MEETING_ACTION_BUTTONS;

    if (answer == present) {
      if (evt?.url) openURL(evt.url);
      askMeetingQuestions();
    }
    if (answer) {
      clearInterval(barking);
      break;
    }
  }
}

module.exports = notifyUser;
