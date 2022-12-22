const {setUpcoming, upcomingEvents, LOOK_AHEAD_MINUTES} = require('../index.js');

function addDummyEvent(summary, uid, offset, location, url) {
  const startDate = new Date();
  startDate.setMinutes(startDate.getMinutes() + offset);

  const evt = {summary, startDate, uid, location, url};
  setUpcoming([...upcomingEvents, evt]);
  console.log('Adding entry to upcomingEvents..');
}

async function addTestEvents() {
  console.log('In testing mode...');
		
  const waitFor = LOOK_AHEAD_MINUTES - 0.5;
  addDummyEvent('Event', '1', waitFor, 'meeting room', 'https://google.com');
}

module.exports = {
  addTestEvents,
  addDummyEvent
}
