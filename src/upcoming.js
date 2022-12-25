const { notifyUser, warnUser, calculateProximity } = require("./notify.js");
const { EVENTS_TO_EXCLUDE } = require('../config.js')
const getEvents = require("./applescript/calendar.js");

let upcomingEvents = [];

function setUpcoming(evts) {
  upcomingEvents = evts;
}

function addEvent(evt) {
  upcomingEvents = [...upcomingEvents, evt];
}

function removeEvent(evt) {
  upcomingEvents = upcomingEvents.filter(({ id }) => evt.id !== id);
  console.log(`Removed ${evt.summary} from upcomingEvents`);
}

function syncCalendarsToUpcoming() {
  getEvents().then((events) => {
    console.log(`Found ${events.length} upcoming events`);
    upcomingEvents = events;
  });
}

function shouldIgnoreEvent(eventToCheck) {
  return EVENTS_TO_EXCLUDE.some((eventPhraseToExclude) => {
    return eventToCheck.summary?.toLowerCase?.includes();
  })
}

function checkUpcomingForMeetings() {
  if (!upcomingEvents?.length) {
    return;
  }

  let expired = [];

  const { length: count } = upcomingEvents,
    now = new Date();

  console.log(`Waiting on ${count} upcoming event${count > 1 ? "s" : ""}`);

  for (let i = 0; i < upcomingEvents.length; i++) {
    const evt = upcomingEvents[i],
      { delta, imminent, soon } = calculateProximity(evt, now);

    if (shouldIgnoreEvent(evt)) {
      console.log('Ignoring event because it matches the excluded event list', evt, EVENTS_TO_EXCLUDE);
    }

    if (soon) {
      warnUser(evt);
    }

    if (delta && imminent && delta < 15) {
      removeEvent(evt);
      notifyUser(evt);
    }
    if (delta <= 0) {
      expired.push(evt.uid);
    }
  }
  if (expired.length) {
    console.log("Removing expired event(s) from upcomingEvents list");
    upcomingEvents = upcomingEvents.filter((evt) => !expired.includes(evt.uid));
  }
}
module.exports = {
  addEvent,
  removeEvent,
  setUpcoming,
  upcomingEvents,
  checkUpcomingForMeetings,
  syncCalendarsToUpcoming,
};
