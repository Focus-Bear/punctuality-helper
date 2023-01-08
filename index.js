//require("./src/keyboard.js");

const addTestEvents = require('./src/testing/index.js'),
    {
        syncCalendarsToUpcoming,
        checkUpcomingForMeetings,
    } = require('./src/upcoming.js')

const {
    SLOW_NAP_DURATION_MINUTES,
    QUICK_NAP_DURATION_SECONDS,
    IS_TESTING,
} = require('./config.js')

const quickInterval = QUICK_NAP_DURATION_SECONDS * 1000,
    slowInterval = SLOW_NAP_DURATION_MINUTES * 60_000

const {
    readSettings,
    checkForFocusBearInstall,
} = require('./src/applescript/fs.js')

const {
    setCalsToExclude,
    setEventsToExclude,
} = require('./src/applescript/calendar.js')

const { setNagState } = require('./src/intention.js')

async function setSettings() {
    const obj = await readSettings()
    const { excluded_calendars, excluded_events } = await readSettings()
    await setCalsToExclude(excluded_calendars)
    await setEventsToExclude(excluded_events)

    const fbInstalled = await checkForFocusBearInstall()
    await setNagState(fbInstalled)
}

async function main() {
    console.log('Late No More Online..')
    await setSettings()

    if (IS_TESTING) await addTestEvents()
    else syncCalendarsToUpcoming()
    checkUpcomingForMeetings()

    setInterval(checkUpcomingForMeetings, quickInterval)
    setInterval(syncCalendarsToUpcoming, slowInterval)
}

main()
    .then(() => {})
    .catch((e) => console.log(e))
