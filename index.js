const LOOK_AHEAD_MINUTES = 2, // how long before a meeting should I notify?
  SLOW_NAP_DURATION_MINUTES = 5, // how often should I look for meetings in iCal?
  QUICK_NAP_DURATION = 0.5, // how often should I check the in-memory list of upcomingEvents
  PAUSE_BETWEEN_BARKS_SECONDS = 5, // how many seconds does each line of dialog have to itself
  // Checking calendars is slow so exclude any that don't contain events you care about.
  // It can be a partial match and it's case insensitive. e.g. Holiday will match "UK holidays"
  CALENDARS_TO_EXCLUDE = ['Birthday', 'Holiday', 'Contacts'],
  isTesting = process.env.NODE_ENV == 'test';

const DIALOG_STAGES = [
    '😊 heads up, meeting starting soon!',
    '😅 fyi your meeting will begin in a moment',
    '😥 all aboard! meeting about to depart',
    '😰 final call!',
    '😱 you are late.',
  ],
  VERBAL_ALERTS = [
    'yellow alert, meeting imminent',
    'red alert',
    "heyyoo... it's time",
    'beep beep!',
    'meeting time!',
    'hey!! check your calendar!',
  ],
  MEETING_QUESTIONS = [
    'what do you want to contribute to the meeting?',
    'what will you learn?',
    'why is it important to pay attention in this meeting?',
  ];

const present = 'Attend meeting',
  truant = "I don't need to attend",
  MEETING_ACTION_BUTTONS = [present, truant];

//
// end of configuration variables
//

let upcomingEvents = [];

function setUpcoming(evts) {
  upcomingEvents = evts;
}

function addEvent(evt) {
  upcomingEvents = [...upcomingEvents, evt];
}

function removeEvent(evt) {
  upcomingEvents = upcomingEvents.filter(({id}) => evt.id !== id);
  console.log(`Removed ${evt.summary} from upcomingEvents`)  	
}

async function main() {
  const { syncCalendarsToUpcoming } = require('./src/calendar-v2.js');
  const { checkUpcomingForMeetings } = require('./src/upcoming.js');

  console.log('Punctuality Helper Online..');

  if (isTesting) {
    const { addTestEvents } = require('./src/testing.js');

    await addTestEvents();
  } else {
    syncCalendarsToUpcoming();
  }

  setInterval(() => syncCalendarsToUpcoming(), SLOW_NAP_DURATION_MINUTES * 60000);

  setInterval(
    () => {
      checkUpcomingForMeetings(upcomingEvents)
    },
    QUICK_NAP_DURATION * 60000,
  );
}

exports.removeEvent = removeEvent;
exports.addEvent = addEvent;
exports.setUpcoming = setUpcoming;
exports.upcomingEvents = upcomingEvents;
exports.MEETING_ACTION_BUTTONS = MEETING_ACTION_BUTTONS;
exports.DIALOG_STAGES = DIALOG_STAGES;
exports.LOOK_AHEAD_MINUTES = LOOK_AHEAD_MINUTES;
exports.PAUSE_BETWEEN_BARKS_SECONDS = PAUSE_BETWEEN_BARKS_SECONDS;
exports.CALENDARS_TO_EXCLUDE = CALENDARS_TO_EXCLUDE;
exports.MEETING_QUESTIONS = MEETING_QUESTIONS;
exports.VERBAL_ALERTS = VERBAL_ALERTS;

main();
