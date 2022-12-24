const {LOOK_AHEAD_MINUTES} = require('../config.js'),
  {notifyUser} = require('./notify.js');

let upcomingEvents = [];

function setUpcoming(evts) {
  upcomingEvents = evts;
}

function addEvent(evt) {
  upcomingEvents = [...upcomingEvents, evt];
}

function removeEvent(evt) {
  upcomingEvents = upcomingEvents.filter(({id}) => evt.id !== id);
  console.log(`Removed ${evt.summary} from upcomingEvents`);
}

async function checkUpcomingForMeetings() {
  if (!upcomingEvents?.length) {
    return;
  }

  let expired = [];

  const count = upcomingEvents.length;
  console.log(`Waiting on ${count} upcoming event${count > 1 ? 's' : ''}`);

  const now = new Date();
  for (let i = 0; i < upcomingEvents.length; i++) {
    const evt = upcomingEvents[i],
      delta = (new Date(evt.startDate) - now) / 1000,
      imminent = delta < LOOK_AHEAD_MINUTES * 60;

    if (imminent > 0) {
      removeEvent(evt);
      notifyUser(evt);
    }
    if (imminent <= 0) {
      expired.push(evt.uid);
    }
  }
  if (expired.length) {
    console.log('Events expired - removing them from list');
    setUpcoming(upcomingEvents.filter(evt => !expired.includes(evt.uid)));
  }
}
const exportFuncs = {
  removeEvent,
  addEvent,
  setUpcoming,
  upcomingEvents,
  checkUpcomingForMeetings,
};

for (const key in exportFuncs) {
  exports[key] = exportFuncs[key];
}
