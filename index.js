const { setUpcoming, checkUpcomingForMeetings } = require("./src/upcoming.js"),
  getEvents = require("./src/applescript/calendar.js");

const {
  SLOW_NAP_DURATION_MINUTES,
  QUICK_NAP_DURATION_SECONDS,
  IS_TESTING,
} = require("./config.js");

async function syncCalendarsToUpcoming() {
  const events = await getEvents();
  console.log(
    `Found ${events.length} upcoming events, ${JSON.stringify(events)}`
  );
  setUpcoming(events);
}

async function main() {
  console.log("Late No More Online..");

  if (IS_TESTING) await require("./src/testing/index.js")();
  else syncCalendarsToUpcoming();

  const quickInterval = QUICK_NAP_DURATION_SECONDS * 60_000,
    slowInterval = SLOW_NAP_DURATION_MINUTES * 60_000;

  setInterval(async () => await syncCalendarsToUpcoming(), slowInterval);
  setInterval(async () => await checkUpcomingForMeetings(), quickInterval);
}

main()
  .then(() => {})
  .catch((e) => console.log(e));
