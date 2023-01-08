const exec = require('./exec.js'),
    { GET_ALL_EVENTS } = require('./scripts.js')

const { SCRIPT_HEADER } = require('./scripts.js')

let EVENTS_TO_EXCLUDE, CALENDARS_TO_EXCLUDE

async function setCalsToExclude(calList) {
    console.log("setting CALENDARS_TO_EXCLUDE",calList )
    CALENDARS_TO_EXCLUDE = calList
}
async function setEventsToExclude(eventList) {
    console.log("setting EVENTS_TO_EXCLUDE", eventList)
    EVENTS_TO_EXCLUDE = eventList
}

async function getCalendars() {
    return await exec(allCalendars)
}

function tidyDate(date) {
    return new Date(date.split(',').slice(1).join(',').replace(' at', ''))
}

function tidyEvent(evt) {
    const tidy = evt.map((field) => {
        if (field == 'missing value') return null
        return field
    })

    const [summary, start, end, url, loc, desc, id, calName] = tidy

    return {
        summary,
        calendarName: calName,
        startDate: tidyDate(start),
        endDate: tidyDate(end),
        location: loc,
        description: desc,
        url,
        id,
    }
}

function filterArray(sourceList, filterBy, key) {
    return sourceList.filter((entry) => filterBy.includes(entry[key]))
}

async function getEvents() {
    const rawEvents = await exec(SCRIPT_HEADER + GET_ALL_EVENTS),
        withOutBlanks = rawEvents.filter((e) => e.length),
        tidied = withOutBlanks.map(tidyEvent)

    return tidied.filter(({ calendarName, summary }) => {
        if (CALENDARS_TO_EXCLUDE.includes(calendarName)) {
            console.log(`Ignoring Calendar '${calendarName}'`)
            return false
        }
        if (EVENTS_TO_EXCLUDE.includes(summary)) {
            console.log(`Ignoring Event '${summary}'`)
            return false
        }
        return true
    })
}
module.exports = { getEvents, setCalsToExclude, setEventsToExclude }
