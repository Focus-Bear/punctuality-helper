const exec = require('./exec.js'),
  {GET_ALL_EVENTS} = require('./scripts.js');

const {CALENDARS_TO_EXCLUDE} = require('../../config.js');
const {SCRIPT_HEADER} = require('./scripts.js');

async function getCalendars() {
  return await exec(allCalendars);
}

function tidyDate(date) {
  return new Date(date.split(',').slice(1).join(',').replace(' at', ''));
}

function tidyEvent(evt) {
  const tidy = evt.map(field => {
    if (field == 'missing value') return null;
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
  try {
    const rawEvents = await exec(SCRIPT_HEADER + GET_ALL_EVENTS),
      withOutBlanks = rawEvents.filter(e => e.length),
      tidied = withOutBlanks.map(tidyEvent);

  return tidied.filter(({ calendarName: name }) => {
    if (CALENDARS_TO_EXCLUDE.includes(name)) {
      console.log(`Ignoring ${name} because it is in one of the excluded calendars`)
      return false;
    }
    return true;
  });
};
