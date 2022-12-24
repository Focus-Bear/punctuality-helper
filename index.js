const {
  IS_TESTING,
  SLOW_NAP_DURATION_MINUTES,
  QUICK_NAP_DURATION,
} = require('./config.js');

async function main() {
  const {syncCalendarsToUpcoming} = require('./src/calendar-v2.js'),
    {checkUpcomingForMeetings} = require('./src/upcoming.js');

  console.log('Punctuality Helper Online..');

  if (IS_TESTING) await require('./src/testing.js')();
  else syncCalendarsToUpcoming();

  const quickInterval = QUICK_NAP_DURATION * 60000,
    slowInterval = SLOW_NAP_DURATION_MINUTES * 60000;

  setInterval(() => syncCalendarsToUpcoming(), slowInterval);
  setInterval(() => checkUpcomingForMeetings(), quickInterval);
}

main()
  .then(() => {})
  .catch(e => console.log(e));
