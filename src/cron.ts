import cron from 'node-cron';
import moment from 'moment-timezone';
import { updateAllClients } from './updateClients';
// Run every minute to check if it's exactly 2:30 PM in Pakistan
cron.schedule('* * * * *', async () => {
  const now = moment().tz('Asia/Karachi');
  const isTargetTime = now.hour() === 19 && now.minute() === 10;

  if (isTargetTime) {
    console.log('⏰ It is 2:30 PM PKT — running update...');
    await updateAllClients();
  } else {
    console.log(`🕒 Current time in PKT: ${now.format('HH:mm')}`);
  }
});
