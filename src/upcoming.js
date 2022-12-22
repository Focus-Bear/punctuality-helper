const {
  upcomingEvents,
  setUpcoming,
  removeEvent,
  LOOK_AHEAD_MINUTES,
} = require('../index.js');
const { notifyUser } = require('./notify.js');

async function checkUpcomingForMeetings() {
  if (!upcomingEvents?.length) return;

  let expired = [];

  const count = upcomingEvents.length;
  console.log(`Waiting on ${count} upcomingEvents event${count > 1 ? 's' : ''}`);

  const now = new Date();
  for (let i = 0; i < upcomingEvents.length; i++) {
    const evt = upcomingEvents[i],
      delta = (new Date(evt.startDate) - now) / 1000,
      imminent = delta < LOOK_AHEAD_MINUTES * 60;

    if (imminent > 0) {
      removeEvent(evt);
      notifyUser(evt);
    }
    if (imminent <= 0) expired.push(evt.uid);
  }
  if (expired.length) {
    setUpcoming(upcomingEvents.filter(evt => !expired.includes(evt.uid)));
  }
}

module.exports = {
  checkUpcomingForMeetings
}
