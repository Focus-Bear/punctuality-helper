const addTestEvents = require("./src/testing/index.js"),
  {
    syncCalendarsToUpcoming,
    checkUpcomingForMeetings,
  } = require("./src/upcoming.js");

const {
  SLOW_NAP_DURATION_MINUTES,
  QUICK_NAP_DURATION_SECONDS,
  IS_TESTING,
} = require("./config.js");

const quickInterval = QUICK_NAP_DURATION_SECONDS * 60_000,
  slowInterval = SLOW_NAP_DURATION_MINUTES * 60_000;

async function main() {
  console.log("Late No More Online..");

  if (IS_TESTING) await addTestEvents();
  else await syncCalendarsToUpcoming();
  await checkUpcomingForMeetings();

  setInterval(async () => await checkUpcomingForMeetings(), quickInterval);
  setInterval(async () => await syncCalendarsToUpcoming(), slowInterval);
}

main()
  .then(() => {})
  .catch((e) => console.log(e));
