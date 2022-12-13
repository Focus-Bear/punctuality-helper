import applescript from 'applescript';

const header = `
		use AppleScript version "2.4" -- Yosemite (10.10) or later
	   	use framework "Foundation"
	   	use scripting additions
	   	use script "CalendarLib EC" version "1.1.1"

		set theStore to fetch store
	 `;

async function exec(script) {
  return new Promise((resolve, reject) => {
    return applescript.execString(header + script, (err, rtn) => {
      if (err) {
        // Something went wrong!
        console.log('Error:', err);
        reject(err);
      }
      resolve(rtn);
    });
  });
}

async function getCalendars() {
  const script = `
	    set theCals to fetch calendars {} event store theStore -- change to suit
		set theTitles to {}
		repeat with aCal in theCals
	      set calTitle to aCal's title() as text
		  log calTitle
		  set theTitles to theTitles & calTitle   
		end repeat

		return theTitles`;

  return await exec(script);
}

async function getEvents() {
  const script = `
    set theCals to fetch calendars {} event store theStore

   	set d1 to (current date)
   	set d2 to d1 + 1 * hours
   	set theEvents to fetch events starting date d1 ending date d2 searching cals theCals event store theStore

	set output to {}

   	repeat with anEvent in theEvents
		set current to {}
   		try
		    copy event_summary of (event info for event anEvent) as text to end of current
		    copy event_start_date of (event info for event anEvent) as text to end of current
		    copy event_end_date of  (event info for event anEvent) as text to end of current
			copy event_url of  (event info for event anEvent) as text to end of current
		    copy event_location of  (event info for event anEvent) as text to end of current
		    copy event_description of (event info for event anEvent) as text to end of current
			copy event_external_ID of (event info for event anEvent) as text to end of current
	   	end try
		copy current to end of output 
    end repeat 
    return output
`;
  const rawEvents = await exec(script);
  return rawEvents
    .filter(e => e.length)
    .map(evt => {
      const [
        summary,
        start_date,
        end_date,
        url,
        location,
        description,
        id,
      ] = evt;

      return {
        summary,
        start_date,
        end_date,
        url,
        location,
        description,
        id,
      };
    });
}

async function main() {
  const cals = await getCalendars(),
    events = await getEvents();
  console.log(cals, events);
}

main().then(() => console.log('done'));
