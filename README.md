# Late No More

Checks local iCal via JXA AppleScript & notifies about upcomingEvents meetings.

## Setup

Clone this repo and run a

`npm install`

Edit config.js if defaults below aren't appropriate for your use case.

Then

`npm run start`

or for testing

`npm run test`

## How it works

There are two core cycles in play:

1. Before execution, any calendars to ignore can be set in **CALENDARS_TO_EXCLUDE**
2. First is to check iCal and save all meetings occuring in the next 30 minutes to a local, in-memory list. This is goverened by **SLOW_NAP_DURATION_MINUTES**
3. Second is to check the upcomingEvents, in-memory list for any immiment meetings and notify. This is goverened by **quickNapDurationMinutes**

## Key variables

```const LOOK_AHEAD_MINUTES = 2, // how long before a meeting should I notify?
SLOW_NAP_DURATION_MINUTES = 5, // how often should I look for meetings in iCal?
quickNapDurationMinutes = 0.5, // how often should I check the in-memory list of upcomingEvents
PAUSE_BETWEEN_BARKS_SECONDS = 5, // how many seconds does each line of dialog have to itself
CALENDARS_TO_EXCLUDE = [], // array of strings, names of calendars
```

## Further Reading / Helpful JXA Resources

- https://github.com/JXA-Cookbook/JXA-Cookbook/wiki
- https://developer.apple.com/library/archive/releasenotes/InterapplicationCommunication/RN-JavaScriptForAutomation/Articles/Introduction.html
