const { notifyUser, warnUser, calculateProximity } = require("./notify.js"),
  getEvents = require("./applescript/calendar.js");

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

function checkUpcomingForMeetings() {
  console.log("Checking upcomingEvents..");
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

    if (soon) warnUser(evt);

    if (imminent && delta < 15) {
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
  removeEvent,
  addEvent,
  setUpcoming,
  upcomingEvents,
  checkUpcomingForMeetings,
  syncCalendarsToUpcoming,
};
