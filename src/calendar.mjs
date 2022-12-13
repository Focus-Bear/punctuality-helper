import {run} from '@jxa/run';
import {setUpcoming, addEvent, calsToExclude} from '../index.mjs';

export async function syncCalendarsToUpcoming() {
  console.log('Checking iCal..');
  const upcoming = await run(calsToExclude => {
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

    const checkEventsInCalendar = (calendar, now, until, attempts = 0) => {
      const newEvents = [];
      let name;
      try {
        name = calendar.name();
        if (calsToExclude.includes(name)) return [];

        const evts = calendar.events.whose({
          _and: [
            { startDate: { _greaterThan: now } },
            { startDate: { _lessThan: until } },
          ],
        }, {timeout: 300});
        if (!evts?.length) return [];

        for (let j = 0; j < evts.length; j++) {
          const evt = { ...parseEvent(evts[j]), calendar: name };
          newEvents.push(evt);
        }
        console.log(`Found ${evts.length} events in calendar ${name}`);

        return newEvents;
      } catch (e) {

        if (attempts < 3) {
          console.log('Retrying ', name, 1)
          return checkEventsInCalendar(calendar, attempts + 1);
        }

        console.log(`in checkEventsInCalendar()`, e);
        return newEvents;
      }
    }

    const app = Application.currentApplication(),
      {calendars} = Application('Calendar');

    app.includeStandardAdditions = true;

    const now = app.currentDate(),
      until = app.currentDate();
    until.setMinutes(until.getMinutes() + 30);

    console.log(`Checking calendars from ${now} to ${until}`);

    let events = [];

    //  for testing, since it can be slow to check them all
    //  for (let i = 0; i < 3; i++) {
    for (let i = 0; i < calendars.length; i++) {
      const calendar = calendars[i];
      const newEvents = checkEventsInCalendar(calendar, now, until);

      events = [...events, ...newEvents];
    }
    console.log('Done checking calendars..');
    return events;
  }, calsToExclude);
  setUpcoming(upcoming);
}
