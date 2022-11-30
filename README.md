# Punctuality helper

Checks local iCal via JXA AppleScript & notifies about upcoming meetings.

## Setup

Clone this repo and run a 

`npm install`

Edit index.mjs if defaults below aren't appropriate for your use case.

Then 

`npm run start`

or for testing

`npm run test`

## How it works

There are two core cycles in play: 

1. Before execution, any calendars to ignore can be set in **calsToExclude**
2. First is to check iCal and save all meetings occuring in the next 30 minutes to a local, in-memory list. This is goverened by **slowNapDurationMinutes**
3. Second is to check the upcoming, in-memory list for any immiment meetings and notify. This is goverened by **quickNapDurationMinutes**

```const lookaheadMinutes = 2, // how long before a meeting should I notify?
slowNapDurationMinutes = 5, // how often should I look for meetings in iCal?
quickNapDurationMinutes = 0.5, // how often should I check the in-memory list of upcoming
pauseBetweenBarksSeconds = 5, // how many seconds does each line of dialog have to itself
calsToExclude = [], // array of strings, names of calendars
```
