const LOOK_AHEAD_MINUTES = 2, // how long before a meeting should I notify?
  SLOW_NAP_DURATION_MINUTES = 5, // how often should I look for meetings in iCal?
  QUICK_NAP_DURATION = 0.5, // how often should I check the in-memory list of upcomingEvents
  PAUSE_BETWEEN_BARKS_SECONDS = 5, // how many seconds does each line of dialog have to itself
  // It can be a partial match and it's case insensitive. e.g. Holiday will match "UK holidays"
  CALENDARS_TO_EXCLUDE = ['Birthday', 'Holiday', 'Contacts'],
  IS_TESTING = process.env.NODE_ENV == 'test';

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
const exportVars = {
  MEETING_ACTION_BUTTONS,
  DIALOG_STAGES,
  LOOK_AHEAD_MINUTES,
  PAUSE_BETWEEN_BARKS_SECONDS,
  CALENDARS_TO_EXCLUDE,
  MEETING_QUESTIONS,
  VERBAL_ALERTS,
  IS_TESTING,
};

for (const key in exportVars) {
  exports[key] = exportVars[key];
}
