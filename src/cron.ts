import cron from 'node-cron';
import moment from 'moment-timezone';
import { updateAllClients } from './functions/updateClients';
import { getMostFocusedTime } from './functions/getMostFocusedTime';

cron.schedule('* * * * *', async () => {
  const now = moment().tz('Asia/Karachi');
  const currentTime = now.format('HH:mm');

  console.log(`🕒 Current PKT time: ${currentTime}`);

  if (now.hour() === 21 && now.minute() === 16) {
    console.log('⏰ It is 9:15 PM PKT — running focused time analysis...');
    await getMostFocusedTime();
  }

  // Example future condition:
  // if (now.hour() === 10 && now.minute() === 0) {
  //   await updateAllClients();
  // }
});
