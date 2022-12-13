use AppleScript version "2.4" -- Yosemite (10.10) or later
use framework "Foundation"
use scripting additions
use script "CalendarLib EC" version "1.1.1"

set theStore to fetch store
set theCals to fetch calendars {} event store theStore -- change to suit
set theTitles to {}
repeat with aCal in theCals
	set end of theTitles to aCal's title() as text
end repeat
log theTitles

set d1 to (current date)
set d2 to d1 + 1 * days
-- only way I can reference single calendar
set theEvents to fetch events starting date d1 ending date d2 searching cals theCals event store theStore

-- searching against all calendar list
-- set theEvents to fetch events starting date d1 ending date d2 searching cals theCal event store theStore
repeat with anEvent in theEvents
	try
		log (event_summary of (event info for event anEvent))
		log (event info for event anEvent)
		log (event identifier for event anEvent)
		log (event attendees for event anEvent)
		log (event recurrence for event anEvent)
	end try
end repeat
