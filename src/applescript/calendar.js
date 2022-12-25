const exec = require("./exec.js"),
  { GET_ALL_EVENTS } = require("./scripts.js");

const { CALENDARS_TO_EXCLUDE } = require("../../config.js");

async function getCalendars() {
  return await exec(allCalendars);
}

function tidyDate(date) {
  return new Date(date.split(",").slice(1).join(",").replace(" at", ""));
}

function tidyEvent(evt) {
  const tidy = evt.map((field) => {
    if (field == "missing value") return null;
    return field;
  });

  const [summary, start, end, url, loc, desc, id, calName] = tidy;

  return {
    summary,
    calendarName: calName,
    startDate: tidyDate(start),
    endDate: tidyDate(end),
    location: loc,
    description: desc,
    url,
    id,
  };
}

module.exports = async function getEvents() {
  const rawEvents = await exec(GET_ALL_EVENTS),
    withOutBlanks = rawEvents.filter((e) => e.length),
    tidied = withOutBlanks.map(tidyEvent);

  return tidied.filter(({ calendarName: name }) => {
    return !CALENDARS_TO_EXCLUDE.includes(name);
  });
};
