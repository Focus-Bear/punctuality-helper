import {run} from '@jxa/run';

async function listCalendars() {
  return await run(() => {
    const app = Application.currentApplication(),
      {calendars} = Application('Calendar');

    app.includeStandardAdditions = true;

    const output = [];

    for (let i = 0; i < calendars.length; i++) {
      const cal = calendars[i],
        name = cal.name();
      output.push(name);
    }
    return output;
  });
}

async function getRange() {
  return await run(() => {
    const app = Application.currentApplication(),
      {calendars} = Application('Calendar');

    app.includeStandardAdditions = true;

    const since = app.currentDate(),
      until = app.currentDate();
    until.setMinutes(until.getMinutes() + 30);

    return {since, until};
  });
}

async function checkCalendar(name, since, until) {
  return await run(
    (name, since, until) => {
      function parseEvent(evt) {
        return {
          uid: evt.uid(),
          description: evt.description(),
          startDate: evt.startDate(),
          summary: evt.summary(),
          locaction: evt?.location(),
          url: evt?.url(),
        };
      }
      const app = Application.currentApplication(),
        Calendar = Application('Calendar'),
        cals = Calendar.calendars.whose({name}),
        calendar = cals[0];

      const newEvents = [];

      since = new Date(since);
      until = new Date(until);

      try {
        const evts = calendar.events.whose({
          _and: [
            {startDate: {_greaterThan: since}},
            {startDate: {_lessThan: until}},
          ],
        });
        if (!evts?.length) return [];

        for (let j = 0; j < evts.length; j++) {
          const evt = {...parseEvent(evts[j]), calendar: name};
          newEvents.push(evt);
          console.log(`Found ${evt.summary} in ${name}`);
        }

        console.log(`Found ${evts.length} events in calendar ${name}`);
        return newEvents;
      } catch (e) {
        console.log(e);
        return [];
      }
    },
    name,
    since,
    until,
  );
}

const checkEventsInCalendar = (calendar, since, until) => {};

(async () => {
  const {since, until} = await getRange(),
    cals = await listCalendars(),
    upcoming = [];

  for (const cal of cals) {
    console.log(cal, since, until);
    const newEvents = await checkCalendar(cal, since, until);
    upcoming.push(...newEvents);
  }
  console.log(upcoming);
})();
