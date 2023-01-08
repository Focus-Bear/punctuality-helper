const { notifyUser, warnUser, calculateProximity } = require('./notify.js')
const { getEvents } = require('./applescript/calendar.js')


let upcomingEvents = []

function setUpcoming(evts) {
    upcomingEvents = evts
}

function addEvent(evt) {
    upcomingEvents = [...upcomingEvents, evt]
}

function removeEvent(evt) {
    console.log('removeEvent()')
    upcomingEvents = upcomingEvents.filter(({ id }) => evt.id !== id)
    console.log(`Removed ${evt.summary} from upcomingEvents`)
}

function syncCalendarsToUpcoming() {
    getEvents().then((events) => {
        console.log(`Found ${events.length} upcoming events`)
        upcomingEvents = events
    })
}

function shouldIgnoreEvent(eventToCheck) {
    return EVENTS_TO_EXCLUDE.some((eventPhraseToExclude) => {
        return eventToCheck?.summary
            ?.toLowerCase()
            ?.includes(eventPhraseToExclude)
    })
}

function checkUpcomingForMeetings() {
    if (!upcomingEvents?.length) {
        return
    }

    let expired = []

    const { length: count } = upcomingEvents,
        now = new Date()

    console.log(
        `Waiting on ${count} upcoming event${count > 1 ? 's' : ''}`,
        JSON.stringify(upcomingEvents)
    )

    for (let i = 0; i < upcomingEvents.length; i++) {
        const evt = upcomingEvents[i],
            { delta, imminent, soon } = calculateProximity(evt, now)

        if (soon) {
            warnUser(evt)
        }

        if (delta && imminent) {
            removeEvent(evt)
            notifyUser(evt)
        }

        // Super late now - stop hassling them
        if (delta <= -10) {
            console.log('Delta', delta, evt)
            expired.push(evt.uid)
        }
    }

    if (expired.length) {
        console.log('Removing expired event(s) from upcomingEvents list')
        upcomingEvents = upcomingEvents.filter(
            (evt) => !expired.includes(evt.uid)
        )
    }
}
module.exports = {
    addEvent,
    removeEvent,
    setUpcoming,
    upcomingEvents,
    checkUpcomingForMeetings,
    syncCalendarsToUpcoming,
}
