import {
  upcoming,
  setUpcoming,
  removeEvent,
  lookaheadMinutes,
} from '../index.mjs';
import notifyUser from './notify.mjs';

export async function checkUpcomingForMeetings() {
  if (!upcoming?.length) return;

  let expired = [];

  const count = upcoming.length;
  console.log(`Waiting on ${count} upcoming event${count > 1 ? 's' : ''}`);

  const now = new Date();
  for (let i = 0; i < upcoming.length; i++) {
    const evt = upcoming[i],
      delta = (new Date(evt.startDate) - now) / 1000,
      imminent = delta < lookaheadMinutes * 60;

    if (imminent > 0) {
      removeEvent(evt);
      notifyUser(evt);
    }
    if (imminent <= 0) expired.push(evt.uid);
  }
  if (expired.length) {
    setUpcoming(upcoming.filter(evt => !expired.includes(evt.uid)));
  }
}
