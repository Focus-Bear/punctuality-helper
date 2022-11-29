import {setUpcoming, upcoming, lookaheadMinutes} from '../index.mjs';

export function addDummyEvent(summary, uid, offset, location, url) {
  const startDate = new Date();
  startDate.setMinutes(startDate.getMinutes() + offset);

  const evt = {summary, startDate, uid, location, url};
  setUpcoming([...upcoming, evt]);
  console.log('Adding entry to upcoming..');
}
export async function addTestEvents() {
  console.log('In testing mode...');
		
  const waitFor = lookaheadMinutes - 0.5;
  addDummyEvent('Event', '1', waitFor, 'meeting room', 'https://google.com');
}
