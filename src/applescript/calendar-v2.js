const exec = require("./exec.js");

const { CALENDARS_TO_EXCLUDE } = require("../../config.js"),
  { events, allCalendars } = require("./scripts.js");

async function getCalendars() {
  return await exec(allCalendars);
}

function tidyDate(date) {
  return new Date(date.split(",").slice(1).join(",").replace(" at", ""));
}

function tidyEvent(evt) {
  const tidy = evt.map((e) => {
    if (e == "missing value") return null;
    return e;
  });

  const [
    summary,
    startDate,
    endDate,
    url,
    location,
    description,
    id,
    calendarName,
  ] = tidy;

  return {
    summary,
    startDate: tidyDate(startDate),
    endDate: tidyDate(endDate),
    url,
    location,
    description,
    id,
    calendarName,
  };
}

module.exports = async function getEvents() {
  const rawEvents = await exec(events),
    withOutBlanks = rawEvents.filter((e) => e.length),
    tidied = withOutBlanks.map(tidyEvent);

  console.log({ tidied });

  return tidied.filter(({ calendarName }) => {
    return !CALENDARS_TO_EXCLUDE.includes(calendarName);
  });
};
