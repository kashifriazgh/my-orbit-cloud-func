import cron from 'node-cron';
import moment from 'moment-timezone';
import { getMostFocusedTime } from './functions/getMostFocusedTime';

// 🕰 Runs every day at 9:15 PM Pakistan Time
cron.schedule('15 25 * * *', async () => {
  const now = moment().tz('Asia/Karachi');
  console.log(
    `⏰ ${now.format('HH:mm')} PKT — running focused time analysis...`
  );
  await getMostFocusedTime();
});
