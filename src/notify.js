const { showDialog, askQuestion } = require("./jxa/dialog.js"),
  openMeetingURL = require("./jxa/event.js"),
  say = require("./jxa/say.js");

const {
  DIALOG_STAGES,
  VERBAL_ALERTS,
  MEETING_QUESTIONS,
  MEETING_ACTION_BUTTONS,
  PAUSE_BETWEEN_BARKS_SECONDS,
} = require("../config.js");

const { showIntention, noIntention } = require("./intention.js");

let barking = false;

function startBarking(evt) {
  console.log("Starting barks...");
  const pauseFor = PAUSE_BETWEEN_BARKS_SECONDS * 1000;

  barking = setInterval(() => {
    const randomIndex = Math.floor(Math.random() * VERBAL_ALERTS.length),
      dialog = VERBAL_ALERTS[randomIndex],
      preamble = "Meeting, '" + evt.summary + "'.",
      toSay = preamble + dialog;

    say(toSay);
  }, pauseFor);
}
function stopBarking() {
  console.log("Silencing barks");
  clearInterval(barking);
}

async function showMeetingAlert(evt, line, givingUpAfter) {
  const title = evt.summary + " " + evt.startDate,
    text = [line, "\n", evt.location, evt.url].join("\n"),
    buttons = MEETING_ACTION_BUTTONS;

  return await showDialog(title, text, buttons, givingUpAfter);
}

module.exports = async function notifyUser(evt) {
  console.log("Notifying user about", evt.summary, evt.startDate);

  const rightNow = new Date(),
    toGo = Math.floor((new Date(evt.startDate) - rightNow) / 1000),
    perStage = Math.floor(toGo / (DIALOG_STAGES.length - 1));

  for (let i = 0; i < DIALOG_STAGES.length; i++) {
    const line = DIALOG_STAGES[i],
      lastRow = i + 1 == DIALOG_STAGES.length,
      givingUpAfter = !lastRow ? perStage : 0;

    if (lastRow && !barking) startBarking(evt);

    const answer = await showMeetingAlert(evt, line, givingUpAfter),
      [present] = MEETING_ACTION_BUTTONS;

    if (answer) stopBarking();
    if (!answer) continue;

    if (answer == present) {
      if (evt?.url) await openMeetingURL(evt.url);

      const question = MEETING_QUESTIONS.join("\n"),
        intention = await askQuestion(question);

      await showIntention(intention);
    }
    await noIntention();
    break;
  }
};
