import {run} from '@jxa/run';
import {addTestEvents} from './src/testing.mjs';
import {syncCalendarsToUpcoming} from './src/calendar-v2.mjs';
import {checkUpcomingForMeetings} from './src/upcoming.mjs';
import {openMeetingURL} from './src/event.js';

export const lookaheadMinutes = 2, // how long before a meeting should I notify?
  slowNapDurationMinutes = 5, // how often should I look for meetings in iCal?
  quickNapDurationMinutes = 0.5, // how often should I check the in-memory list of upcoming
  pauseBetweenBarksSeconds = 5, // how many seconds does each line of dialog have to itself
  // Checking calendars is slow so exclude any that don't contain events you care about.
  // It can be a partial match and it's case insensitive. e.g. Holiday will match "UK holidays"
  calsToExclude = ['Birthday', 'Holiday', 'Contacts'],
  testing = process.env.NODE_ENV == 'test';

export const dialogStages = [
    '😊 heads up, meeting starting soon!',
    '😅 fyi your meeting will begin in a moment',
    '😥 all aboard! meeting about to depart',
    '😰 final call!',
    '😱 you are late.',
  ],
  verbalAlerts = [
    'yellow alert, meeting imminent',
    'red alert',
    "heyyoo... it's time",
    'beep beep!',
    'meeting time!',
    'hey!! check your calendar!',
  ],
  meetingQuestions = [
    'what do you want to contribute to the meeting?',
    'what will you learn?',
    'why is it important to pay attention in this meeting?',
  ];

export const present = 'Attend meeting',
  truant = "I don't need to attend",
  buttons = [present, truant];

//
// end of configuration variables
//

export let upcoming = [],
  busy = false;

export function setUpcoming(evts) {
  upcoming = evts;
}

export function addEvent(evt) {
  upcoming = [...upcoming, evt];
}

async function execute(callback) {
  busy = true;
  callback();
  busy = false;
}

async function main() {
  console.log('Punctuality Helper Online..');

  if (testing) await addTestEvents();
  else syncCalendarsToUpcoming();

  setInterval(() => {
    execute(syncCalendarsToUpcoming);
  }, slowNapDurationMinutes * 60000);

  setInterval(() => {
    if (busy) return;
    execute(checkUpcomingForMeetings);
    //
  }, quickNapDurationMinutes * 60000);
}

main();
