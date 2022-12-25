const { run } = require("@jxa/run");

async function showMeeting(calendar, uid) {
  return await run(
    (name, uid) => {
      try {
        const Calendar = Application("Calendar"),
          projectCalendars = Calendar.calendars.whose({ name }),
          projectCalendar = projectCalendars[0],
          events = projectCalendar.events.whose({ uid }),
          event = events[0];

        event.show();
      } catch (e) {
        console.log("Error in showMeeting():", e);
      }
    },
    calendar,
    uid
  );
}

async function openMeetingURL(url) {
  return await run((url) => {
    console.log("Opening url ", url);
    try {
      const Safari = Application("Safari");

      Safari.activate();

      const window = Safari.windows[0],
        newTab = Safari.Tab({ url });

      window.tabs.push(newTab);
      window.currentTab = newTab;
    } catch (e) {
      console.log("Error in openURL() :", e);
    }
  }, url);
}

module.exports = {
  openMeetingURL,
  showMeeting,
};
