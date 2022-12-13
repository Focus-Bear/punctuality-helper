import {run} from '@jxa/run';
async function getRange() {
  return await run(() => {
    const app = Application.currentApplication()

    app.includeStandardAdditions = true;

    const since = app.currentDate(),
      until = app.currentDate();
    until.setMinutes(until.getMinutes() + 30);

    return {since, until};
  });
}
const {since: startingDate, until: endingDate} = getRange();

run(
  (startingDate, endingDate) => {
    console.log('in JXA env');
    try {
      ObjC.import('Foundation');
      const app = Application.currentApplication();
      app.includeStandardAdditions = true;

      Calendar = Library('CalendarLib EC');
      eventStore = Calendar.fetchStore;


      console.log(eventStore.length);
      calendars = Calendar.fetchCalendars({eventStore});
      // events = Calendar.fetchEvents({startingDate, endingDate, eventStore});
    } catch (e) {
      console.log(e);
    }
  },
  startingDate,
  endingDate,
);
