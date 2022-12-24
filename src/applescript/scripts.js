const header = `
		use AppleScript version "2.4" -- Yosemite (10.10) or later
	   	use framework "Foundation"
	   	use scripting additions
	   	use script "CalendarLib EC" version "1.1.1"

		set theStore to fetch store
	 `,
  events = `
        set theCals to fetch calendars {} event store theStore
		set d1 to (current date)
		set d2 to d1 + 1 * hours
		set theEvents to fetch events starting date d1 ending date d2 searching cals theCals event store theStore

		set output to {}

		repeat with anEvent in theEvents
			set startTime to event_start_date of (event info for event anEvent)
			set current to {}
			if (startTime ≥ d1) and (startTime ≤ d2) then
				try
					
					copy event_summary of (event info for event anEvent) as text to end of current
					copy event_start_date of (event info for event anEvent) as text to end of current
					copy event_end_date of (event info for event anEvent) as text to end of current
					copy event_url of (event info for event anEvent) as text to end of current
					copy event_location of (event info for event anEvent) as text to end of current
					copy event_description of (event info for event anEvent) as text to end of current
					copy event_external_ID of (event info for event anEvent) as text to end of current
					copy calendar_name of (event info for event anEvent) as text to end of current
					
					copy current to end of output
				end try
			end if
		end repeat
		return output
`,
  allCalendars = `
	    set theCals to fetch calendars {} event store theStore -- change to suit
		set theTitles to {}
		repeat with aCal in theCals
	      set calTitle to aCal's title() as text
		  log calTitle
		  set theTitles to theTitles & calTitle   
		end repeat

		return theTitles`;

module.exports = {header, events, allCalendars};
